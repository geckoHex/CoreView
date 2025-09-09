# Import server
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from functools import wraps
from datetime import datetime, timedelta
import secrets
import dotenv
import os

# Import helper functions
from commands.info import get_time
from commands.filemanager import file_manager

# Create the Flask app
app = Flask(__name__)
app.secret_key = secrets.token_hex(16)  # Generate a secure secret key for sessions
app.permanent_session_lifetime = timedelta(minutes=5)  # Session expires after 5 minutes

CORS(
    app,
    origins=["http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:8080", "http://127.0.0.1:3000"],  # Enable frontend sites
    supports_credentials=True  # Allow cookies/credentials to be sent
)

# Simple user store (in production, use a database)
dotenv.load_dotenv()
USERS = {
    os.environ.get('ADMIN_USERNAME'): os.environ.get('ADMIN_PASSWORD')
}

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            return jsonify(error="Authentication required"), 401
        
        # Check if session has expired (Flask handles this automatically with permanent_session_lifetime)
        # But we'll also update the session to extend expiration on activity
        session.permanent = True
        
        return f(*args, **kwargs)
    return decorated_function

# No-endpoint request (default)
@app.route("/")
def home():
    return jsonify(content=""), 204

# Server health endpoint
@app.route("/health")
def update_server_health():
    return jsonify(content="Server is online"), 200

# Authentication endpoints
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify(error="JSON data required"), 400
    
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify(error="Username and password required"), 400
    
    if username in USERS and USERS[username] == password:
        session.permanent = True
        session['user'] = username
        return jsonify(message="Login successful", user=username), 200
    else:
        return jsonify(error="Invalid credentials"), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop('user', None)
    return jsonify(message="Logout successful"), 200

@app.route("/auth")
def auth_status():
    if 'user' in session:
        session.permanent = True  # Extend session on activity
        return jsonify(auth=True, user=session['user']), 200
    else:
        return jsonify(auth=False), 200

# Returns some text
@app.route("/echo")
@login_required
def echo():
    message = request.args.get("message")
    if not message:
        return jsonify(error="No message was provided"), 400
    return jsonify(content=message), 200

# Returns a reversed string
@app.route("/reverse")
@login_required
def reverse_string():
    message = request.args.get("message")
    if not message:
        return jsonify(error="No message was provided"), 400
    return jsonify(content=message[::-1]), 200

# Adds two numbers
@app.route("/add")
@login_required
def add():
    try:
        # Get num1 and num2 from query params
        num1 = request.args.get("num1", type=float)
        num2 = request.args.get("num2", type=float)

        # Validation
        if num1 is None or num2 is None:
            return jsonify(error="Both 'num1' and 'num2' query params are required"), 400

        result = num1 + num2
        return jsonify(result=result), 200
    except ValueError:
        return jsonify(error="Invalid number format"), 400

# Get's the current formatted time
@app.route("/clock")
@login_required
def clock():
    system_time: str = get_time()
    return jsonify(content=system_time), 200

# File Manager endpoints
@app.route("/files/list")
@login_required
def list_files():
    path = request.args.get("path", os.path.expanduser("~"))
    show_hidden = request.args.get("show_hidden", "false").lower() == "true"
    
    # Handle empty path or special home path
    if not path or path == "~":
        path = os.path.expanduser("~")
    
    result = file_manager.list_directory(path, show_hidden)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/search")
@login_required
def search_files():
    path = request.args.get("path", os.path.expanduser("~"))
    pattern = request.args.get("pattern", "*")
    show_hidden = request.args.get("show_hidden", "false").lower() == "true"
    
    if not pattern:
        return jsonify(error="Search pattern required"), 400
    
    result = file_manager.search_files(path, pattern, show_hidden)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/info")
@login_required
def get_file_info():
    path = request.args.get("path")
    
    if not path:
        return jsonify(error="File path required"), 400
    
    result = file_manager.get_file_info(path)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/read")
@login_required
def read_file():
    path = request.args.get("path")
    
    if not path:
        return jsonify(error="File path required"), 400
    
    result = file_manager.read_file(path)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/create", methods=["POST"])
@login_required
def create_file():
    data = request.get_json()
    if not data:
        return jsonify(error="JSON data required"), 400
    
    path = data.get("path")
    content = data.get("content", "")
    
    if not path:
        return jsonify(error="File path required"), 400
    
    result = file_manager.create_file(path, content)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/mkdir", methods=["POST"])
@login_required
def create_directory():
    data = request.get_json()
    if not data:
        return jsonify(error="JSON data required"), 400
    
    path = data.get("path")
    
    if not path:
        return jsonify(error="Directory path required"), 400
    
    result = file_manager.create_directory(path)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/move", methods=["POST"])
@login_required
def move_file():
    data = request.get_json()
    if not data:
        return jsonify(error="JSON data required"), 400
    
    source = data.get("source")
    destination = data.get("destination")
    
    if not source or not destination:
        return jsonify(error="Source and destination paths required"), 400
    
    result = file_manager.move_item(source, destination)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

@app.route("/files/delete", methods=["DELETE"])
@login_required
def delete_file():
    data = request.get_json()
    if not data:
        return jsonify(error="JSON data required"), 400
    
    path = data.get("path")
    
    if not path:
        return jsonify(error="File path required"), 400
    
    result = file_manager.delete_item(path)
    
    if "error" in result:
        return jsonify(error=result["error"]), 400
    
    return jsonify(result), 200

# Custom 404 handler
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="404 Not Found: The requested URL was not found on the server."), 404

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True, port=5001)
