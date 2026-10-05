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
from datetime import datetime, timezone

PORT = int(os.environ.get("PORT", 8000))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(DIRECTORY, "assets", "data", "cms-data.json")

# Server-side authentication configuration
AUTH_SALT = os.environ.get("ADMIN_SALT", "gida_auth_salt_2026_x89")
AUTH_SECRET = os.environ.get("AUTH_SECRET", "gida_jwt_secret_token_key_2026_secure")
STORED_HASH = os.environ.get("ADMIN_PASSWORD_HASH", "7b2e26163ba4bf249fa9045a56cc06c72e00b95013740733bb2eb912dcca9178")
ALLOWED_USERS = [u.strip().lower() for u in os.environ.get("ADMIN_IDENTIFIERS", "admin@gida-action.org,admin,gida-admin").split(",") if u.strip()]

def hash_password(password, salt):
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000, 32).hex()

def verify_password(entered_password):
    entered_hash = hash_password(entered_password, AUTH_SALT)
    return hmac.compare_digest(entered_hash, STORED_HASH)

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

class GidaCMSHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent caching of JSON and HTML during active editing
        if self.path.endswith('.json') or self.path.endswith('.html') or self.path.startswith('/api/'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
            self.send_header('Pragma', 'no-cache')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Auth-Token')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_HEAD(self):
        if self.path == '/admin' or self.path.startswith('/admin/') or self.path.startswith('/admin?'):
            self.path = '/admin.html'
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
        else:
            self.send_error(404, "Endpoint not found")

    def handle_login(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
            data = json.loads(body)
            raw_id = (data.get('identifier') or data.get('username') or data.get('email') or '').strip()
            raw_pass = str(data.get('password') or '')

            is_valid_user = bool(raw_id and raw_id.lower() in ALLOWED_USERS)
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

            response_data = {
                "success": True,
                "message": "CMS data synchronized directly to disk.",
                "updatedAt": cms_payload['updatedAt']
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

class GidaServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

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
