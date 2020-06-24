# import necessary packages
from flask import Flask, request
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
import ssl

# import flask app
from main import app

# obtain connection string for database
CONN_STRING = ""
with open("credentials.json", "r") as data:

    # save connection string variable
    CONN_STRING = json.load(data)["connectionStr"]

# connect to database
todo_db_conn = MongoClient(CONN_STRING, ssl_cert_reqs=ssl.CERT_NONE)["ToDo"]
TODO_ID_TABLE = ObjectId("5ee0274c7c71c6a064dd056c")

@app.route("/getDragPosition") 
def get_drag_pos():
    """
    Method to get the drag position of the given todo list
    using the database information
    """

    # save information on the id of the todo list passed from the frontend
    todo_id = int(dict(request.headers)["Todo-Id"])

    # save user name passed from the frontend
    user_name = dict(request.headers)["Username"]

    # save user information to query database
    user_query = {
        "username": user_name
    }

    # find todo lists for the given user
    todo_lists = todo_db_conn.users.find_one(user_query)["todo_ids"]

    # iterate through user's todo lists
    for todo_info in todo_lists:

        # get data for todo list
        todo = dict(todo_lists[todo_info])

        # if id is a match, return the drag position of the todo list
        if int(todo["id"]) == todo_id:

            # return information about position
            return_json = {
                "success": True,
                "position": todo["position"]
            }

            # return success message and pertinent information
            return json.dumps(return_json), 200, {"ContentType": "application/json"}

    # if no todo list information was found, return unsuccessful message
    return json.dumps({"success": False}), 500, {"ContentType": "application/json"}

@app.route("/moveDragPosition") 
def move_drag_pos():
    """
    Method to move the drag position of the given todo list and save
    it in the database.
    """

    # save data on todo list passed in from the frontend
    data = dict(request.headers)

    # save todo id, todo name, and username
    todo_id = int(data["Todo-Id"])
    todo_name = data["Todo-Name"]
    user_name = data["Username"]
    
    # save new x and y drag positions of todo list
    new_pos = eval(data["Newposition"])
    new_x = new_pos["x"]
    new_y = new_pos["y"]
    
    # move position to given new position in database
    position_dict = {"x": new_x, "y": new_y}


    # save user information to query database
    user_query = {
        "username": user_name
    }

    # update the position of the todo list element in database
    todo_db_conn.users.update_one(
        user_query,
        {"$set":
            {f"todo_ids.{todo_name}.position": position_dict}
        }
    )

    # return success message once process is complete
    return json.dumps({"success": True}), 200, {"ContentType":"application/json"}