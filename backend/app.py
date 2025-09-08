from flask import Flask, jsonify

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

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
