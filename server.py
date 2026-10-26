#!/usr/bin/env python3
"""
GIDA Live Development & CMS Synchronization Server
Provides static file serving, handles live CMS persistence to assets/data/cms-data.json,
and handles administrative authentication with PBKDF2 password hashing.
"""

import http.server
import socket
import socketserver
import json
import os
import sys
import re
import base64
import hashlib
import hmac
import subprocess
import threading
import csv
import io
import urllib.request
import urllib.parse
from datetime import datetime, timezone

PORT = int(os.environ.get("PORT", 8000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(DIRECTORY, "assets", "data", "cms-data.json")
REGISTRATIONS_FILE = os.path.join(DIRECTORY, "assets", "data", "registrations.json")
reg_lock = threading.Lock()

# Server-side authentication configuration
AUTH_SALT = os.environ.get("ADMIN_SALT", "gida_auth_salt_2026_x89")
AUTH_SECRET = os.environ.get("AUTH_SECRET", "gida_jwt_secret_token_key_2026_secure")
STORED_HASH = os.environ.get("ADMIN_PASSWORD_HASH", "7b2e26163ba4bf249fa9045a56cc06c72e00b95013740733bb2eb912dcca9178")
LEGACY_HASH = "bc15f800316d3a91699b2d5161f85bde4ecdc32005974b3f4f8d96eb74e1f8d4" # admin123
ALLOWED_USERS = [u.strip().lower() for u in os.environ.get("ADMIN_IDENTIFIERS", "admin@gida-action.org,admin,gida-admin,info@gida-action.org,superadmin,gida,usman").split(",") if u.strip()]

def hash_password(password, salt):
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000, 32).hex()

def verify_password(entered_password):
    if not entered_password:
        return False
    entered_hash = hash_password(entered_password, AUTH_SALT)
    return hmac.compare_digest(entered_hash, STORED_HASH) or hmac.compare_digest(entered_hash, LEGACY_HASH)

def generate_session_token(identifier):
    now_ts = datetime.now(timezone.utc).timestamp()
    payload = {
        "sub": identifier,
        "iat": int(now_ts * 1000),
        "exp": int((now_ts + 86400) * 1000) # 24 hours
    }
    encoded_payload = base64.urlsafe_b64encode(json.dumps(payload).encode("utf-8")).decode("utf-8").rstrip("=")
    sig = hmac.new(AUTH_SECRET.encode("utf-8"), encoded_payload.encode("utf-8"), hashlib.sha256).digest()
    encoded_sig = base64.urlsafe_b64encode(sig).decode("utf-8").rstrip("=")
    return f"{encoded_payload}.{encoded_sig}"

def verify_session_token(token):
    if not token or "." not in token:
        return None
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        encoded_payload, received_sig = parts
        sig = hmac.new(AUTH_SECRET.encode("utf-8"), encoded_payload.encode("utf-8"), hashlib.sha256).digest()
        expected_sig = base64.urlsafe_b64encode(sig).decode("utf-8").rstrip("=")
        if not hmac.compare_digest(received_sig, expected_sig):
            return None
        
        rem = len(encoded_payload) % 4
        if rem > 0:
            encoded_payload += "=" * (4 - rem)
        payload = json.loads(base64.urlsafe_b64decode(encoded_payload.encode("utf-8")).decode("utf-8"))
        if payload.get("exp", 0) < int(datetime.now(timezone.utc).timestamp() * 1000):
            return None
        return payload
    except Exception:
        return None

def load_registrations():
    with reg_lock:
        if not os.path.exists(REGISTRATIONS_FILE):
            return []
        try:
            with open(REGISTRATIONS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        except Exception as e:
            print(f"[REGISTRATIONS READ ERROR] {e}")
            return []

def save_registrations(records):
    with reg_lock:
        os.makedirs(os.path.dirname(REGISTRATIONS_FILE), exist_ok=True)
        temp_file = REGISTRATIONS_FILE + ".tmp"
        with open(temp_file, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        
        if os.name == 'nt':
            import time
            if os.path.exists(REGISTRATIONS_FILE):
                try:
                    os.replace(temp_file, REGISTRATIONS_FILE)
                except PermissionError:
                    time.sleep(0.05)
                    os.replace(temp_file, REGISTRATIONS_FILE)
            else:
                os.rename(temp_file, REGISTRATIONS_FILE)
        else:
            os.rename(temp_file, REGISTRATIONS_FILE)

def get_sheets_webhook_url():
    env_url = (os.environ.get("GOOGLE_SHEETS_WEBHOOK_URL") or "").strip()
    if env_url:
        return env_url
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                cms_data = json.load(f)
                return (cms_data.get("googleSheetsWebhookUrl") or "").strip()
    except Exception:
        pass
    return "https://script.google.com/macros/s/AKfycbzRFIBzhiU8B7MuITKV41Pq9Enm4nzwdBOeOIdz4VvbRA2Qk1gqa0D-AmxPRWDhBwVxXQ/exec"

def send_to_google_sheets(record, webhook_url):
    if not webhook_url:
        return {"success": False, "configured": False, "reason": "unconfigured"}
    try:
        data_bytes = json.dumps(record, ensure_ascii=False).encode('utf-8')
        req = urllib.request.Request(
            webhook_url,
            data=data_bytes,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'GIDA-Registration-Sync/1.0'
            },
            method='POST'
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            content = resp.read().decode('utf-8')
            if '<!doctype html>' in content.lower() or 'accounts.google.com' in content:
                return {
                    "success": False,
                    "configured": True,
                    "status": 401,
                    "error": "Google Web App permissions issue: Web app redirected to Google Sign-In. In Google Apps Script, click Deploy > Manage deployments > Edit (pencil) > set 'Who has access' to 'Anyone' > Deploy."
                }
            try:
                res_data = json.loads(content)
            except Exception:
                res_data = {"raw": content}

            if resp.status in [200, 201, 302] and res_data.get("success") is not False:
                return {"success": True, "configured": True, "data": res_data}
            else:
                return {
                    "success": False,
                    "configured": True,
                    "status": resp.status,
                    "error": res_data.get("error") or res_data.get("message") or "Google Sheet returned non-success response."
                }
    except urllib.error.HTTPError as http_err:
        if http_err.code in [401, 403]:
            return {
                "success": False,
                "configured": True,
                "status": http_err.code,
                "error": "Google Web App returned 401 Unauthorized: In Google Apps Script, click Deploy > Manage deployments > Edit > set 'Who has access' to 'Anyone'."
            }
        return {"success": False, "configured": True, "error": f"HTTP Error {http_err.code}: {http_err.reason}"}
    except Exception as err:
        return {"success": False, "configured": True, "error": str(err)}

class GidaCMSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent caching of JSON and HTML during active editing
        if self.path.endswith('.json') or self.path.endswith('.html') or self.path.startswith('/api/'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def check_admin_auth(self):
        auth_hdr = self.headers.get('Authorization') or self.headers.get('X-Auth-Token') or ''
        token = auth_hdr[7:].strip() if auth_hdr.startswith('Bearer ') else auth_hdr.strip()
        if not token:
            parsed = urllib.parse.urlparse(self.path)
            q = urllib.parse.parse_qs(parsed.query)
            token = q.get('token', [''])[0]
        return verify_session_token(token)

    def send_json_response(self, data, status=200):
        res_bytes = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(res_bytes)))
        self.end_headers()
        self.wfile.write(res_bytes)

    def do_HEAD(self):
        if self.path == '/admin' or self.path.startswith('/admin/') or self.path.startswith('/admin?'):
            self.path = '/admin.html'
        elif self.path in ['/register', '/register/', '/registration', '/registration/', '/event-registration', '/event-registration/'] or self.path.startswith('/register?') or self.path.startswith('/registration?') or self.path.startswith('/event-registration?'):
            self.path = '/register.html'
        if self.path.startswith('/api/get-cms'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        # Protected and clean admin routing
        if self.path == '/admin' or self.path.startswith('/admin/') or self.path.startswith('/admin?'):
            self.path = '/admin.html'
        elif self.path in ['/register', '/register/', '/registration', '/registration/', '/event-registration', '/event-registration/'] or self.path.startswith('/register?') or self.path.startswith('/registration?') or self.path.startswith('/event-registration?'):
            self.path = '/register.html'

        if self.path.startswith('/api/health'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            res = json.dumps({"status": "ok", "server": "GIDA Live Dev Server", "port": PORT}).encode('utf-8')
            self.send_header('Content-Length', str(len(res)))
            self.end_headers()
            self.wfile.write(res)
        elif self.path.startswith('/api/auth-check'):
            self.handle_auth_check()
        elif self.path.startswith('/api/get-cms'):
            self.serve_cms_data()
        elif self.path.startswith('/api/admin/registrations/export'):
            self.handle_export_registrations()
        elif self.path.startswith('/api/admin/registrations'):
            self.handle_get_registrations()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/login'):
            self.handle_login()
        elif self.path.startswith('/api/auth-check'):
            self.handle_auth_check()
        elif self.path.startswith('/api/logout'):
            self.handle_logout()
        elif self.path.startswith('/api/save-cms'):
            self.handle_save_cms()
        elif self.path.startswith('/api/upload-pdf') or self.path.startswith('/api/upload-file'):
            self.handle_upload_file()
        elif self.path.startswith('/api/push-changes') or self.path.startswith('/api/git-push'):
            self.handle_push_changes()
        elif self.path.startswith('/api/register'):
            self.handle_register()
        elif self.path.startswith('/api/admin/test-sheets-webhook'):
            self.handle_test_sheets_webhook()
        elif self.path.startswith('/api/admin/registrations/sync-sheets'):
            self.handle_sync_registrations_to_sheets()
        elif self.path.startswith('/api/admin/registrations/delete'):
            self.handle_delete_registration()
        else:
            self.send_error(404, "Endpoint not found")

    def do_DELETE(self):
        if self.path.startswith('/api/admin/registrations'):
            self.handle_delete_registration()
        else:
            self.send_error(404, "Endpoint not found")

    def handle_login(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            data = json.loads(body)
            raw_id = (data.get('identifier') or data.get('username') or data.get('email') or '').strip()
            raw_pass = str(data.get('password') or '')

            is_valid_user = bool(raw_id and len(raw_id) >= 1)
            is_valid_pass = verify_password(raw_pass) if raw_pass else False

            if not (is_valid_user and is_valid_pass):
                res_bytes = json.dumps({"success": False, "message": "Invalid email or password."}).encode('utf-8')
                self.send_response(401)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Content-Length', str(len(res_bytes)))
                self.end_headers()
                self.wfile.write(res_bytes)
                return

            token = generate_session_token(raw_id)
            res_data = {"success": True, "token": token, "user": raw_id, "expiresIn": 86400}
            res_bytes = json.dumps(res_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            print(f"[AUTH LOGIN] Administrator '{raw_id}' logged in successfully.")
        except Exception as e:
            res_bytes = json.dumps({"success": False, "message": "Authentication service error."}).encode('utf-8')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)

    def handle_auth_check(self):
        auth_hdr = self.headers.get('Authorization') or self.headers.get('X-Auth-Token') or ''
        token = auth_hdr[7:].strip() if auth_hdr.startswith('Bearer ') else auth_hdr.strip()
        
        session = verify_session_token(token)
        if not session:
            res_bytes = json.dumps({"authenticated": False, "message": "Session invalid or expired."}).encode('utf-8')
            self.send_response(401)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            return

        res_data = {"authenticated": True, "user": session.get("sub"), "expiresAt": session.get("exp")}
        res_bytes = json.dumps(res_data).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(res_bytes)))
        self.end_headers()
        self.wfile.write(res_bytes)

    def handle_logout(self):
        res_bytes = json.dumps({"success": True, "message": "Signed out successfully."}).encode('utf-8')
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(res_bytes)))
        self.end_headers()
        self.wfile.write(res_bytes)

    def serve_cms_data(self):
        try:
            if not os.path.exists(DATA_FILE):
                self.send_error(404, "CMS data file not found")
                return
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                content_bytes = f.read().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(content_bytes)))
            self.end_headers()
            self.wfile.write(content_bytes)
        except Exception as e:
            self.send_error(500, f"Error reading data: {str(e)}")

    def handle_save_cms(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self.send_error(400, "Empty payload")
                return

            body = self.rfile.read(content_length).decode('utf-8')
            cms_payload = json.loads(body)

            if not isinstance(cms_payload, dict):
                self.send_error(400, "Payload must be a JSON object")
                return

            cms_payload['updatedAt'] = datetime.utcnow().isoformat() + "Z"

            os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
            temp_file = DATA_FILE + ".tmp"
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(cms_payload, f, indent=2, ensure_ascii=False)

            if os.name == 'nt':
                import time
                if os.path.exists(DATA_FILE):
                    try:
                        os.replace(temp_file, DATA_FILE)
                    except PermissionError:
                        time.sleep(0.05)
                        os.replace(temp_file, DATA_FILE)
                else:
                    os.rename(temp_file, DATA_FILE)
            else:
                os.rename(temp_file, DATA_FILE)

            pushed = False
            git_err = None
            try:
                subprocess.run(['git', 'add', 'assets/data/cms-data.json', 'assets/img', 'assets/docs'], cwd=DIRECTORY, capture_output=True, text=True)
                status_proc = subprocess.run(['git', 'status', '--porcelain'], cwd=DIRECTORY, capture_output=True, text=True)
                if status_proc.stdout.strip():
                    commit_msg = f"Update CMS content from Super Admin: {cms_payload['updatedAt']}"
                    commit_proc = subprocess.run(['git', 'commit', '-m', commit_msg], cwd=DIRECTORY, capture_output=True, text=True)
                    if commit_proc.returncode == 0:
                        push_proc = subprocess.run(['git', 'push', 'origin', 'master'], cwd=DIRECTORY, capture_output=True, text=True)
                        if push_proc.returncode == 0:
                            pushed = True
                            print(f"[CMS PUSH] Successfully auto-pushed CMS updates to origin/master")
                        else:
                            git_err = push_proc.stderr.strip() or push_proc.stdout.strip()
                            print(f"[CMS PUSH WARNING] Push failed: {git_err}")
                    else:
                        git_err = commit_proc.stderr.strip()
                        print(f"[CMS COMMIT WARNING] Commit failed: {git_err}")
                else:
                    pushed = True
            except Exception as ge:
                git_err = str(ge)
                print(f"[CMS GIT ERROR] {git_err}")

            response_data = {
                "success": True,
                "serverSaved": True,
                "pushed": pushed,
                "message": "CMS data saved to disk and pushed live to GitHub repository!" if pushed else "CMS data saved to disk locally.",
                "updatedAt": cms_payload['updatedAt'],
                "gitError": git_err
            }
            
            res_bytes = json.dumps(response_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            print(f"[CMS SYNC] Successfully persisted live update at {cms_payload['updatedAt']}")

        except json.JSONDecodeError as err:
            err_bytes = json.dumps({"success": False, "error": f"Invalid JSON: {str(err)}"}).encode('utf-8')
            self.send_response(400)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(err_bytes)))
            self.end_headers()
            self.wfile.write(err_bytes)
        except Exception as e:
            err_bytes = json.dumps({"success": False, "error": str(e)}).encode('utf-8')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(err_bytes)))
            self.end_headers()
            self.wfile.write(err_bytes)

    def handle_upload_file(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self.send_error(400, "Empty payload")
                return

            body = self.rfile.read(content_length).decode('utf-8')
            payload = json.loads(body)
            raw_name = payload.get('filename', 'document.pdf')
            clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', os.path.basename(raw_name))
            is_image = clean_name.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg'))
            if not is_image and not clean_name.lower().endswith('.pdf'):
                clean_name += '.pdf'

            file_b64 = payload.get('data', '')
            if ',' in file_b64:
                file_b64 = file_b64.split(',', 1)[1]

            file_bytes = base64.b64decode(file_b64)
            if is_image:
                target_dir = os.path.join(DIRECTORY, "assets", "img")
                rel_path = f"assets/img/{clean_name}"
            else:
                target_dir = os.path.join(DIRECTORY, "assets", "docs")
                rel_path = f"assets/docs/{clean_name}"

            os.makedirs(target_dir, exist_ok=True)
            target_path = os.path.join(target_dir, clean_name)

            with open(target_path, 'wb') as f:
                f.write(file_bytes)

            res_data = {
                "success": True,
                "filePath": rel_path,
                "filename": clean_name,
                "size": len(file_bytes),
                "isImage": is_image,
                "message": f"Successfully uploaded {clean_name}"
            }
            res_bytes = json.dumps(res_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            print(f"[FILE UPLOAD] Saved {clean_name} ({len(file_bytes)} bytes) to {rel_path}")

        except Exception as e:
            err_bytes = json.dumps({"success": False, "error": str(e)}).encode('utf-8')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(err_bytes)))
            self.end_headers()
            self.wfile.write(err_bytes)

    def handle_push_changes(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            try:
                payload = json.loads(body) if body.strip() else {}
            except Exception:
                payload = {}
            commit_msg = payload.get('message', 'Update CMS content and site data from Super Admin')

            # 1. Stage all changes
            add_proc = subprocess.run(['git', 'add', '-A'], cwd=DIRECTORY, capture_output=True, text=True)
            if add_proc.returncode != 0:
                raise Exception(f"git add failed: {add_proc.stderr}")

            # 2. Check if there are uncommitted changes to commit
            status_proc = subprocess.run(['git', 'status', '--porcelain'], cwd=DIRECTORY, capture_output=True, text=True)
            committed = False
            if status_proc.stdout.strip():
                commit_proc = subprocess.run(['git', 'commit', '-m', commit_msg], cwd=DIRECTORY, capture_output=True, text=True)
                if commit_proc.returncode != 0:
                    raise Exception(f"git commit failed: {commit_proc.stderr}")
                committed = True

            # 3. Detect current branch
            branch_proc = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], cwd=DIRECTORY, capture_output=True, text=True)
            branch = branch_proc.stdout.strip() or 'master'

            # 4. Git push to origin
            push_proc = subprocess.run(['git', 'push', 'origin', branch], cwd=DIRECTORY, capture_output=True, text=True)
            if push_proc.returncode != 0:
                error_detail = push_proc.stderr.strip() or push_proc.stdout.strip() or 'Unknown push error'
                raise Exception(f"git push failed: {error_detail}")

            res_data = {
                "success": True,
                "committed": committed,
                "branch": branch,
                "message": f"Successfully pushed all changes to origin/{branch}!"
            }
            res_bytes = json.dumps(res_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(res_bytes)))
            self.end_headers()
            self.wfile.write(res_bytes)
            print(f"[GIT PUSH] Successfully pushed changes to origin/{branch}")

        except Exception as e:
            err_bytes = json.dumps({"success": False, "error": str(e)}).encode('utf-8')
            self.send_response(500)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(err_bytes)))
            self.end_headers()
            self.wfile.write(err_bytes)

    def handle_register(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self.send_json_response({"success": False, "message": "Empty submission payload."}, status=400)
                return

            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body) if body.strip() else {}

            errors = {}

            # Section 1: Delegate & Institutional Identity
            full_name = str(data.get("fullName") or "").strip()
            if len(full_name) < 2:
                errors["fullName"] = "Please enter your full name."

            email = str(data.get("email") or "").strip().lower()
            if not email or not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
                errors["email"] = "Please enter a valid official email address."

            phone = str(data.get("phone") or "").strip()
            if len(phone) < 7:
                errors["phone"] = "Please enter a valid phone or WhatsApp number."

            organization = str(data.get("organization") or "").strip()
            if len(organization) < 2:
                errors["organization"] = "Please enter your organization or institution name."

            designation = str(data.get("designation") or "").strip()
            if len(designation) < 2:
                errors["designation"] = "Please enter your official job title or designation."

            footprint = data.get("operationalFootprint") or []
            if not isinstance(footprint, list) or len(footprint) == 0:
                errors["operationalFootprint"] = "Please select at least one operational footprint region in Nigeria."

            # Section 2: Institutional Role in the FI Ecosystem
            archetype = str(data.get("stakeholderArchetype") or "").strip()
            if not archetype:
                errors["stakeholderArchetype"] = "Please select a stakeholder archetype that best describes your organization."
            archetype_other = str(data.get("stakeholderArchetypeOther") or "").strip()
            if "other" in archetype.lower() and not archetype_other:
                errors["stakeholderArchetypeOther"] = "Please specify your organization type."

            fin_products = data.get("financialProducts") or []
            if not isinstance(fin_products, list) or len(fin_products) == 0:
                errors["financialProducts"] = "Please select at least one primary financial product or service delivered."

            # Section 3: Ground-Level Challenges & Systemic Bottlenecks
            top_barriers = data.get("topBarriers") or []
            if not isinstance(top_barriers, list) or len(top_barriers) == 0:
                errors["topBarriers"] = "Please select at least 1 barrier (up to 3)."
            elif len(top_barriers) > 3:
                errors["topBarriers"] = "Please select a maximum of 3 barriers only."

            challenge = str(data.get("biggestOperationalChallenge") or "").strip()
            if not challenge:
                errors["biggestOperationalChallenge"] = "Please describe the single biggest operational challenge your organization faces."
            else:
                words = challenge.split()
                if len(words) > 50:
                    errors["biggestOperationalChallenge"] = f"Please limit response to 50 words maximum (currently {len(words)} words)."

            # Section 4: Collaboration, Public Funds & Ecosystem Synergies
            offer_caps = data.get("offerCapabilities") or []
            if not isinstance(offer_caps, list) or len(offer_caps) == 0:
                errors["offerCapabilities"] = "Please select at least one asset, capability, or resource offered."

            needed_support = str(data.get("neededSupport") or "").strip()
            if not needed_support:
                errors["neededSupport"] = "Please select the support or resource you need most."

            consortium = str(data.get("consortiumInterest") or "").strip()
            if not consortium:
                errors["consortiumInterest"] = "Please select your consortium participation interest."

            # Section 5: Voice of the Frontline
            opportunity = str(data.get("overlookedOpportunity") or "").strip()
            if len(opportunity) < 5:
                errors["overlookedOpportunity"] = "Please share a practical overlooked opportunity in rural financial inclusion."

            successful_model = str(data.get("successfulModel") or "").strip()
            if len(successful_model) < 5:
                errors["successfulModel"] = "Please share one successful project, tool, or pilot model."

            # Section 6: Post-Event Engagement Commitments
            report_consent = str(data.get("reportFeatureConsent") or "").strip()
            if not report_consent:
                errors["reportFeatureConsent"] = "Please indicate your report feature preference."

            wg_interest = str(data.get("workingGroupInterest") or "").strip()
            if not wg_interest:
                errors["workingGroupInterest"] = "Please indicate if you are interested in post-event working groups."

            if errors:
                first_msg = next(iter(errors.values()))
                self.send_json_response({"success": False, "message": first_msg, "errors": errors}, status=400)
                return

            records = load_registrations()

            # Prevent duplicate submissions from exact same email within last 2 minutes
            now_dt = datetime.now(timezone.utc)
            for r in reversed(records):
                if r.get("email", "").lower() == email:
                    try:
                        submitted_dt = datetime.fromisoformat(r.get("submittedAt", "").replace("Z", "+00:00"))
                        if (now_dt - submitted_dt).total_seconds() < 120:
                            self.send_json_response({
                                "success": True,
                                "duplicate": True,
                                "registrationId": r.get("id"),
                                "registration": r,
                                "message": "Existing registration confirmed."
                            }, status=200)
                            return
                    except Exception:
                        pass

            # Determine next reference number
            max_num = 1000
            for r in records:
                m = re.search(r"GIDA-RW2026-(\d+)", str(r.get("id", "")))
                if m:
                    num = int(m.group(1))
                    if num > max_num:
                        max_num = num

            new_id = f"GIDA-RW2026-{max_num + 1}"
            new_record = {
                "id": new_id,
                "submittedAt": now_dt.isoformat().replace("+00:00", "Z"),
                "fullName": full_name,
                "email": email,
                "phone": phone,
                "organization": organization,
                "designation": designation,
                "operationalFootprint": footprint,
                "stakeholderArchetype": archetype,
                "stakeholderArchetypeOther": archetype_other,
                "financialProducts": fin_products,
                "topBarriers": top_barriers,
                "biggestOperationalChallenge": challenge,
                "offerCapabilities": offer_caps,
                "neededSupport": needed_support,
                "consortiumInterest": consortium,
                "overlookedOpportunity": opportunity,
                "successfulModel": successful_model,
                "reportFeatureConsent": report_consent,
                "workingGroupInterest": wg_interest,
                "status": "confirmed"
            }

            # Primary destination: Google Sheets integration
            webhook_url = get_sheets_webhook_url()
            sheets_result = send_to_google_sheets(new_record, webhook_url)

            if not sheets_result.get("success"):
                err_msg = sheets_result.get("error") or "Google Sheets synchronization failed."
                print(f"[SHEETS SYNC ERROR] Registration rejected: {err_msg}")
                # Save to local records marked as unsynced
                new_record["googleSheetsSynced"] = False
                new_record["googleSheetsError"] = err_msg
                records.append(new_record)
                save_registrations(records)
                self.send_json_response({
                    "success": False,
                    "message": f"Could not record registration in Google Sheet: {err_msg}",
                    "error": err_msg
                }, status=502)
                return

            new_record["googleSheetsSynced"] = True
            new_record.pop("googleSheetsError", None)
            records.append(new_record)
            save_registrations(records)

            print(f"[REGISTRATION SUCCESS] Registered {new_id} for {email} ({organization}) and saved to Google Sheets.")
            self.send_json_response({
                "success": True,
                "registrationId": new_id,
                "registration": new_record,
                "googleSheetsSynced": True,
                "message": "Registration confirmed and recorded in Google Sheet."
            }, status=200)

        except Exception as e:
            print(f"[REGISTRATION ERROR] {e}")
            self.send_json_response({
                "success": False,
                "message": f"Server error processing registration: {str(e)}"
            }, status=500)

    def handle_test_sheets_webhook(self):
        session = self.check_admin_auth()
        if not session:
            self.send_json_response({"success": False, "message": "Unauthorized. Super Admin login required."}, status=401)
            return
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            data = json.loads(body)
            target_url = (data.get('webhookUrl') or '').strip() or get_sheets_webhook_url()
            if not target_url:
                self.send_json_response({"success": False, "message": "No Google Sheets Webhook URL provided."}, status=400)
                return

            test_record = {
                "id": "GIDA-TEST-PING",
                "submittedAt": datetime.now(timezone.utc).isoformat(),
                "fullName": "GIDA System Webhook Test",
                "email": "admin@gida-action.org",
                "phone": "+234 800 GIDA ACTION",
                "organization": "GIDA Action",
                "designation": "Administrator",
                "operationalFootprint": ["Nationwide"],
                "stakeholderArchetype": "NGO / CSO / Development Agency",
                "stakeholderArchetypeOther": "",
                "financialProducts": ["Connectivity Test"],
                "topBarriers": ["System Test"],
                "biggestOperationalChallenge": "Live webhook connection test ping from Super Admin.",
                "offerCapabilities": ["Integration Test"],
                "neededSupport": "Verification confirmation",
                "consortiumInterest": "Yes",
                "overlookedOpportunity": "Automation",
                "successfulModel": "GIDA Webhook Model",
                "reportFeatureConsent": "Internal Verification",
                "workingGroupInterest": "Yes",
                "status": "test-ping"
            }
            res = send_to_google_sheets(test_record, target_url)
            if res.get("success"):
                self.send_json_response({
                    "success": True,
                    "message": "Connection verified! Test ping written to Google Sheet successfully.",
                    "details": res.get("data")
                }, status=200)
            else:
                self.send_json_response({
                    "success": False,
                    "message": f"Connection failed: {res.get('error', 'Webhook error')}",
                    "details": res
                }, status=502)
        except Exception as e:
            self.send_json_response({"success": False, "message": f"Test error: {str(e)}"}, status=500)

    def handle_sync_registrations_to_sheets(self):
        session = self.check_admin_auth()
        if not session:
            self.send_json_response({"success": False, "message": "Unauthorized. Super Admin login required."}, status=401)
            return
        webhook_url = get_sheets_webhook_url()
        if not webhook_url:
            self.send_json_response({"success": False, "message": "Google Sheets Webhook URL is not configured."}, status=400)
            return

        records = load_registrations()
        synced_count = 0
        failed_count = 0
        last_error = None

        for r in records:
            res = send_to_google_sheets(r, webhook_url)
            if res.get("success"):
                r["googleSheetsSynced"] = True
                r.pop("googleSheetsError", None)
                synced_count += 1
            else:
                r["googleSheetsSynced"] = False
                last_error = res.get("error")
                r["googleSheetsError"] = last_error
                failed_count += 1

        save_registrations(records)
        if failed_count == 0:
            self.send_json_response({
                "success": True,
                "message": f"Successfully synced all {synced_count} registrations to Google Sheet!",
                "synced": synced_count
            }, status=200)
        else:
            self.send_json_response({
                "success": False,
                "message": f"Synced {synced_count} entries, but {failed_count} failed: {last_error}",
                "synced": synced_count,
                "failed": failed_count,
                "error": last_error
            }, status=502)

    def handle_get_registrations(self):
        session = self.check_admin_auth()
        if not session:
            self.send_json_response({"success": False, "message": "Unauthorized. Super Admin login required."}, status=401)
            return

        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)

        search_q = (qs.get("q", [""])[0]).strip().lower()
        filter_archetype = (qs.get("archetype", [""])[0]).strip()
        filter_footprint = (qs.get("footprint", [""])[0]).strip()
        filter_consent = (qs.get("consent", [""])[0]).strip()
        filter_wg = (qs.get("workingGroup", [""])[0]).strip()
        sort_by = (qs.get("sort", ["newest"])[0]).strip()

        records = load_registrations()
        total_count = len(records)

        filtered = []
        for r in records:
            if search_q:
                haystack = " ".join([
                    r.get("id", ""),
                    r.get("fullName", ""),
                    r.get("email", ""),
                    r.get("phone", ""),
                    r.get("organization", ""),
                    r.get("designation", "")
                ]).lower()
                if search_q not in haystack:
                    continue

            if filter_archetype and filter_archetype != "all":
                if filter_archetype.lower() not in r.get("stakeholderArchetype", "").lower():
                    continue

            if filter_footprint and filter_footprint != "all":
                fps = [f.lower() for f in r.get("operationalFootprint", [])]
                if not any(filter_footprint.lower() in f for f in fps):
                    continue

            if filter_consent and filter_consent != "all":
                c = r.get("reportFeatureConsent", "").lower()
                if filter_consent == "publish" and "publish" not in c:
                    continue
                elif filter_consent == "anonymous" and "anonymous" not in c and "aggregated" not in c:
                    continue

            if filter_wg and filter_wg != "all":
                if r.get("workingGroupInterest", "").lower() != filter_wg.lower():
                    continue

            filtered.append(r)

        # Sorting
        if sort_by == "oldest":
            filtered.sort(key=lambda x: x.get("submittedAt", ""))
        elif sort_by == "name":
            filtered.sort(key=lambda x: x.get("fullName", "").lower())
        elif sort_by == "org":
            filtered.sort(key=lambda x: x.get("organization", "").lower())
        else: # newest
            filtered.sort(key=lambda x: x.get("submittedAt", ""), reverse=True)

        self.send_json_response({
            "success": True,
            "total": total_count,
            "filteredCount": len(filtered),
            "registrations": filtered
        }, status=200)

    def handle_delete_registration(self):
        session = self.check_admin_auth()
        if not session:
            self.send_json_response({"success": False, "message": "Unauthorized. Super Admin login required."}, status=401)
            return

        target_id = ""
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        if "id" in qs:
            target_id = qs["id"][0].strip()

        if not target_id:
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                if content_length > 0:
                    body = self.rfile.read(content_length).decode('utf-8')
                    body_json = json.loads(body)
                    target_id = str(body_json.get("id") or "").strip()
            except Exception:
                pass

        if not target_id:
            self.send_json_response({"success": False, "message": "Missing registration ID to delete."}, status=400)
            return

        records = load_registrations()
        initial_len = len(records)
        records = [r for r in records if r.get("id") != target_id]

        if len(records) == initial_len:
            self.send_json_response({"success": False, "message": f"Registration {target_id} not found."}, status=404)
            return

        save_registrations(records)
        print(f"[REGISTRATION DELETED] Admin '{session.get('sub')}' deleted record {target_id}")
        self.send_json_response({
            "success": True,
            "message": f"Registration {target_id} deleted permanently.",
            "remaining": len(records)
        }, status=200)

    def handle_export_registrations(self):
        session = self.check_admin_auth()
        if not session:
            self.send_json_response({"success": False, "message": "Unauthorized. Super Admin login required."}, status=401)
            return

        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)

        search_q = (qs.get("q", [""])[0]).strip().lower()
        filter_archetype = (qs.get("archetype", [""])[0]).strip()
        filter_footprint = (qs.get("footprint", [""])[0]).strip()
        filter_consent = (qs.get("consent", [""])[0]).strip()
        filter_wg = (qs.get("workingGroup", [""])[0]).strip()

        records = load_registrations()
        filtered = []
        for r in records:
            if search_q:
                haystack = " ".join([
                    r.get("id", ""),
                    r.get("fullName", ""),
                    r.get("email", ""),
                    r.get("phone", ""),
                    r.get("organization", ""),
                    r.get("designation", "")
                ]).lower()
                if search_q not in haystack:
                    continue
            if filter_archetype and filter_archetype != "all":
                if filter_archetype.lower() not in r.get("stakeholderArchetype", "").lower():
                    continue
            if filter_footprint and filter_footprint != "all":
                fps = [f.lower() for f in r.get("operationalFootprint", [])]
                if not any(filter_footprint.lower() in f for f in fps):
                    continue
            if filter_consent and filter_consent != "all":
                c = r.get("reportFeatureConsent", "").lower()
                if filter_consent == "publish" and "publish" not in c:
                    continue
                elif filter_consent == "anonymous" and "anonymous" not in c and "aggregated" not in c:
                    continue
            if filter_wg and filter_wg != "all":
                if r.get("workingGroupInterest", "").lower() != filter_wg.lower():
                    continue
            filtered.append(r)

        filtered.sort(key=lambda x: x.get("submittedAt", ""), reverse=True)

        output = io.StringIO()
        output.write("\ufeff") # Excel UTF-8 BOM

        writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)
        writer.writerow([
            "Reference ID",
            "Submitted At (UTC)",
            "1. Full Name",
            "2. Official Email Address",
            "3. Phone Number / WhatsApp",
            "4. Organization / Institution Name",
            "5. Job Title / Designation",
            "6. Primary Operational Footprint",
            "7. Stakeholder Archetype",
            "7. Other Archetype Specification",
            "8. Primary Financial Products/Services",
            "9. Top 3 Barriers to Rural Women FI",
            "10. Biggest Operational Challenge (Max 50 Words)",
            "11. Assets & Capabilities Offered",
            "12. Support & Resource Needed Most",
            "13. Consortium Participation Interest",
            "14. Practical Overlooked Opportunity",
            "15. Successful Project / Pilot Model",
            "16. Report Profile Feature Consent",
            "17. Post-Event Working Group Interest"
        ])

        for r in filtered:
            writer.writerow([
                r.get("id", ""),
                r.get("submittedAt", ""),
                r.get("fullName", ""),
                r.get("email", ""),
                r.get("phone", ""),
                r.get("organization", ""),
                r.get("designation", ""),
                "; ".join(r.get("operationalFootprint") or []),
                r.get("stakeholderArchetype", ""),
                r.get("stakeholderArchetypeOther", ""),
                "; ".join(r.get("financialProducts") or []),
                "; ".join(r.get("topBarriers") or []),
                r.get("biggestOperationalChallenge", ""),
                "; ".join(r.get("offerCapabilities") or []),
                r.get("neededSupport", ""),
                r.get("consortiumInterest", ""),
                r.get("overlookedOpportunity", ""),
                r.get("successfulModel", ""),
                r.get("reportFeatureConsent", ""),
                r.get("workingGroupInterest", "")
            ])

        csv_bytes = output.getvalue().encode('utf-8')
        filename = f"gida-event-registrations-{datetime.now().strftime('%Y%m%d-%H%M')}.csv"

        self.send_response(200)
        self.send_header('Content-Type', 'text/csv; charset=utf-8')
        self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
        self.send_header('Content-Length', str(len(csv_bytes)))
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.end_headers()
        self.wfile.write(csv_bytes)

class GidaServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(self, server_address, RequestHandlerClass):
        self.address_family = socket.AF_INET
        super().__init__(("0.0.0.0", server_address[1]), RequestHandlerClass)

if __name__ == "__main__":
    print(f"Starting GIDA Live CMS Server on http://localhost:{PORT} and http://127.0.0.1:{PORT}...")
    print(f"Serving directory: {DIRECTORY}")
    print(f"CMS Data file: {DATA_FILE}")
    try:
        with GidaServer(("0.0.0.0", PORT), GidaCMSHandler) as httpd:
            print(f"Server live at http://localhost:{PORT} and http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
    except Exception as e:
        print(f"Failed to bind port {PORT}: {e}")
        sys.exit(1)
