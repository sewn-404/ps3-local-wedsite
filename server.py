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

# --- 2. Configuration ---
PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler
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