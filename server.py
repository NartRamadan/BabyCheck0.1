#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple HTTP Server for BabyCheck Demo
Run this to serve the HTML file locally
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Set the port
PORT = 8000

# Change to the directory containing index.html
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def start_server():
    """Start the HTTP server"""
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"🚀 BabyCheck Server starting...")
            print(f"📍 Server running at: http://localhost:{PORT}")
            print(f"🌐 Open this URL in your browser: http://localhost:{PORT}")
            print(f"🛑 Press Ctrl+C to stop the server")
            print("=" * 50)
            
            # Try to open browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("✅ Browser opened automatically!")
            except:
                print("⚠️  Please open the URL manually in your browser")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 10048:  # Port already in use
            print(f"❌ Port {PORT} is already in use. Try a different port or close other applications.")
        else:
            print(f"❌ Error starting server: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    start_server()
