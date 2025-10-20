import http.server
import socketserver
import socket

def get_host_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_error(self, format, *args):
        # Check if this is a TLS handshake attempt
        if isinstance(args[0], str) and "Bad request version" in args[0]:
            if not hasattr(self.server, 'showed_tls_notice'):
                print("\nNote: Received HTTPS/TLS connection attempt. This is a plain HTTP server.")
                print("Make sure to use http:// not https:// when connecting.")
                print(f"Correct URL: http://{HOST_IP}:{PORT}")
                self.server.showed_tls_notice = True
            return
        # Log other errors normally
        super().log_error(format, *args)

    def log_message(self, format, *args):
        # Filter out TLS handshake noise
        if "code 400, message Bad request version" in format % args:
            return
        if '"\\x16\\x03\\x01' in format % args:  # TLS handshake prefix
            return
        # Log other messages normally
        super().log_message(format, *args)

# --- 2. Configuration ---
PORT = 8000
Handler = QuietHandler  # Use our quieter handler
HOST_IP = get_host_ip()
SERVER_URL = f"http://{HOST_IP}:{PORT}"

# --- 3. Start the Server ---
try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"==================================================")
        print(f"PS3 Local Server is RUNNING!")
        print(f"--------------------------------------------------")
        print(f"Your PC's IP Address (Host IP): {HOST_IP}")
        print(f"Port: {PORT}")
        print(f"")
        print(f"Connect your PS3 browser to this URL:")
        print(f"   >>> {SERVER_URL} <<<")
        print(f"")
        print(f"Press Ctrl+C to stop the server.")
        print(f"==================================================")
        
        httpd.serve_forever()

except PermissionError:
    print(f"\nERROR: Permission denied. Port {PORT} might be blocked or in use.")
    print("Try running the script with administrator/root privileges.")
except KeyboardInterrupt:
    print("\n[Server Stopped] Shutting down the server...")