# import necessary packages
from flask import Flask, request
import json
from pymongo import MongoClient
import hashlib
import ssl

# import flask app
from main import app

# obtain connection string for database
CONN_STRING = ""
with open("credentials.json", "r") as data:

    # save connection string variable
    CONN_STRING = json.load(data)["connectionStr"]

@app.route('/login', methods=["GET", "POST"])
def login_user():
    """
    Method to verify user with database and return
    true if the authentication is successful.
    """

    # save user information passed from the frontend
    user_data = request.headers
    user_pw = user_data["Password"]

    # connect to database
    todo_db_conn = MongoClient(CONN_STRING,ssl_cert_reqs=ssl.CERT_NONE)['ToDo']
    
    # save user information to query from database
    user_query = {
        "username": user_data["User"] 
    }

    # hash user-inputted password
    hashed_user_pw = hashlib.sha512(user_pw.encode('utf-8')).hexdigest()

    # verify that user does not already exist in database
    user_exists = todo_db_conn.users.find_one(user_query)

    # if user does not exist or password is incorrect, return unsuccessful attempt
    if user_exists == None or hashed_user_pw != user_exists["password"]:

        return json.dumps({"success":False}), 200, {"Content-Type": "application/json"}

    # set json to return
    todo_return = {
        "success": True
    }
    
    # return success message in appropriate format
    return json.dumps(todo_return), 200, {"Content-Type":"application/json"}

@app.route("/signup")
def signup():
    """
    Method to add the user to database with hashed password.
    """

    # save user information passed in from the frontend
    user_data = request.headers

    # connect to database
    todo_db_conn = MongoClient(CONN_STRING)["ToDo"]

    # save user information to query from database
    user_query = {
        "username": user_data["User"] 
    }

    # verify that user does not already exist in database
    user_exists = todo_db_conn.users.find_one(user_query)

    # if user account already exists, unable to sign up
    if user_exists != None:

        return json.dumps({"success":False}), 404, {"Content-Type":"application/json"}
    
    # hash user's inputted password
    pswd = user_data["Password"]
    hashed_pw  = hashlib.sha512(pswd.encode('utf-8')).hexdigest()

    # save new user's information to add to database
    user_info = {
        "username": user_data["User"],
        "password": hashed_pw,
        "todo_ids": {}
    }

    # insert user record into database
    todo_db_conn.users.insert_one(user_info)

    # return success message for signup endpoint
    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}
