# import flask library
from flask import Flask, request
from flask_cors import CORS

# create flask app and allow CORS (Cross Origin Resource Sharing)
app = Flask(__name__)
CORS(app)

# import files containing flask endpoints
import todo
import todo_lists
import move_todo_lists
import authentication

# when the file is started, run the flask app
if __name__ == "__main__":
    app.run()