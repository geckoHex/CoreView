# Import server
from flask import Flask, jsonify, request

# Import helper functions
from commands.info import get_time

# Create the Flask app
app = Flask(__name__)

# Define a route for the homepage
@app.route("/")
def home():
    return jsonify(message="Hello, Flask!", status="success")

@app.route("/user/<username>")
def get_user(username):
    # Example user "object"
    user_data = {"username": username, "role": "admin", "active": True}
    return jsonify(user_data)

@app.route("/clock")
def clock():
    system_time: str = get_time()
    return jsonify(content=system_time), 200

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
