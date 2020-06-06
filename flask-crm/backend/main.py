from flask import Flask, request
from flask_cors import CORS
import json
from pymongo import MongoClient
import hashlib
app = Flask(__name__)
CORS(app)

#import other file
import todo

CONN_STRING = ""
with open("credentials.json", "r") as data:
    CONN_STRING = json.load(data)["connectionStr"]

@app.route('/login', methods=["GET", "POST"])
def login_user():
    """
    Method to verify user with database and return
    true if the authentication is successful.
    """
    user_data = request.headers
    user_pw = user_data["Password"]
    #print(user_data)

    #connect to database
    todo_db_conn = MongoClient(CONN_STRING)['ToDo']
    user_query = {
        "username": user_data["User"] 
    }

    #hash user inputted password
    hashed_user_pw = hashlib.sha512(user_pw.encode('utf-8')).hexdigest()

    #verify that user does not already exist in database
    user_exists = todo_db_conn.users.find_one(user_query)
    if user_exists == None or hashed_user_pw != user_exists["password"]:
        return json.dumps({"success":False}), 200, {"Content-Type": "application/json"}

    success = {"success": True}
    todo_return = {
        "success": True
    }
        #user_todo[]
    return json.dumps(todo_return), 200, {"Content-Type":"application/json"}

@app.route("/signup")
def signup():
    """
    Method to add the user to database with hashed password.
    """
    user_data = request.headers

    #connect to database
    todo_db_conn = MongoClient(CONN_STRING)["ToDo"]
    user_query = {
        "username": user_data["User"] 
    }

    #verify that user does not already exist in database
    user_exists = todo_db_conn.users.find_one(user_query)
    if user_exists != None:
        return json.dumps({"success":False}), 404, {"Content-Type":"application/json"}
    
    #hash user's inputted password
    pswd = user_data["Password"]
    hashed_pw  = hashlib.sha512(pswd.encode('utf-8')).hexdigest()
    user_info = {
        "username": user_data["User"],
        "password": hashed_pw,
        "todo_ids": {}
    }

    #insert user record into db
    todo_db_conn.users.insert_one(user_info)

    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}


if __name__ == "__main__":
    print("Running")
    app.run()