from flask import Flask

# Create the Flask app
app = Flask(__name__)

# Define a route for the homepage
@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/about")
def about():
    return "This is the About page!"

# Run only if the script is executed directly
if __name__ == "__main__":
    app.run(debug=True)
