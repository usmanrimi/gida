#!/usr/bin/env python3
"""
GIDA Live Development & CMS Synchronization Server
Provides static file serving and handles live CMS persistence to assets/data/cms-data.json
"""

import http.server
import socketserver
import json
import os
import sys
import re
import base64
from datetime import datetime

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(DIRECTORY, "assets", "data", "cms-data.json")

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
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_HEAD(self):
        if self.path.startswith('/api/get-cms'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        if self.path.startswith('/api/get-cms'):
            self.serve_cms_data()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/save-cms'):
            self.handle_save_cms()
        elif self.path.startswith('/api/upload-pdf') or self.path.startswith('/api/upload-file'):
            self.handle_upload_file()
        else:
            self.send_error(404, "Endpoint not found")

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
            self.send_error(500, f"Error reading CMS data: {str(e)}")

    def handle_save_cms(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self.send_error(400, "Empty payload")
                return

            body = self.rfile.read(content_length).decode('utf-8')
            cms_payload = json.loads(body)

            # Ensure timestamp is set
            cms_payload['updatedAt'] = datetime.utcnow().isoformat() + "Z"

            # Ensure parent directory exists
            os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)

            # Write atomically using a temporary file
            temp_file = DATA_FILE + ".tmp"
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(cms_payload, f, indent=2, ensure_ascii=False)
            
            # Atomic replace
            if os.path.exists(DATA_FILE):
                os.replace(temp_file, DATA_FILE)
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
            # Sanitize filename
            clean_name = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', os.path.basename(raw_name))
            if not clean_name.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg', '.webp')):
                clean_name += '.pdf'

            file_b64 = payload.get('data', '')
            if ',' in file_b64:
                file_b64 = file_b64.split(',', 1)[1]

            file_bytes = base64.b64decode(file_b64)
            docs_dir = os.path.join(DIRECTORY, "assets", "docs")
            os.makedirs(docs_dir, exist_ok=True)
            target_path = os.path.join(docs_dir, clean_name)

            with open(target_path, 'wb') as f:
                f.write(file_bytes)

            rel_path = f"assets/docs/{clean_name}"
            res_data = {
                "success": True,
                "filePath": rel_path,
                "filename": clean_name,
                "size": len(file_bytes),
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

import socket
import contextlib

class DualStackServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

    if getattr(socket, 'has_dualstack_ipv6', lambda: False)():
        address_family = socket.AF_INET6

    def server_bind(self):
        with contextlib.suppress(Exception):
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        return super().server_bind()

if __name__ == "__main__":
    print(f"Starting GIDA Live CMS Server on http://localhost:{PORT} and http://127.0.0.1:{PORT}...")
    print(f"Serving directory: {DIRECTORY}")
    print(f"CMS Data file: {DATA_FILE}")
    try:
        with DualStackServer(("", PORT), GidaCMSHandler) as httpd:
            print(f"Server live at http://localhost:{PORT} (DualStack IPv4/IPv6 active)")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
    except Exception as e:
        print(f"Failed to bind port {PORT}: {e}")
        sys.exit(1)
