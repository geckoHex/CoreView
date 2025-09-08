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
