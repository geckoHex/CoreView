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

# Custom 404 handler
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="404 Not Found: The requested URL was not found on the server."), 404

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True, port=5001)
