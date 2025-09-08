# Import server
from flask import Flask, jsonify, request

# Import helper functions
from commands.info import get_time

# Create the Flask app
app = Flask(__name__)

# No-endpoint request (default)
@app.route("/")
def home():
    return jsonify(content=""), 200

# Returns text the user passes in
@app.route("/echo/<message>")
def get_user(message):
    # Example user "object"
    return jsonify(content=message), 200

# Get's the current formatted time
@app.route("/clock")
def clock():
    system_time: str = get_time()
    return jsonify(content=system_time), 200

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
