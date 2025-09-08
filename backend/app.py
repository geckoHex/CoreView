# Import server
from flask import Flask, jsonify, request

# Import helper functions
from commands.info import get_time

# Create the Flask app
app = Flask(__name__)

# No-endpoint request (default)
@app.route("/")
def home():
    return jsonify(content=""), 204

# Server health endpoint
@app.route("/health")
def update_server_health():
    return jsonify(content="Server is online"), 200

# Returns some text
@app.route("/echo")
def echo():
    message = request.args.get("message")
    if not message:
        return jsonify(error="No message was provided"), 400
    return jsonify(content=message), 200

# Returns a reversed string
@app.route("/reverse")
def reverse_string():
    message = request.args.get("message")
    if not message:
        return jsonify(error="No message was provided"), 400
    return jsonify(content=message[::-1]), 200

# Adds two numbers
@app.route("/add")
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
def clock():
    system_time: str = get_time()
    return jsonify(content=system_time), 200

# Custom 404 handler
@app.errorhandler(404)
def not_found(error):
    return jsonify(error="404 Not Found: The requested URL was not found on the server."), 404

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
