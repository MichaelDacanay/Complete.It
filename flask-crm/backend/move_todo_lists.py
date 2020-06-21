#imports
from flask import Flask, request
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.json_util import dumps
import ssl

#import flask app
from main import app

CONN_STRING = ""
with open("credentials.json", "r") as data:
    CONN_STRING = json.load(data)["connectionStr"]

#connect to db
todo_db_conn = MongoClient(CONN_STRING, ssl_cert_reqs=ssl.CERT_NONE)["ToDo"]
TODO_ID_TABLE = ObjectId("5ee0274c7c71c6a064dd056c")

@app.route("/getDragPosition") 
def get_drag_pos():
    """
    Method to get the drag position of the given todo list
    using the database information
    """
    todo_id = int(dict(request.headers)["Todo-Id"])
    user_name = dict(request.headers)["Username"]

    #print(todo_id, user_name)
    user_query = {
        "username": user_name
    }

    #get all todo lists for the given user
    todo_lists = todo_db_conn.users.find_one(user_query)["todo_ids"]

    #iterate through user's todo lists
    for todo_info in todo_lists:

        #get data for that todo list
        todo = dict(todo_lists[todo_info])

        #if id is a match, return the drag position
        if int(todo["id"]) == todo_id:

            #return information about position
            return_json = {
                "success": True,
                "position": todo["position"]
            }

            return json.dumps(return_json), 200, {"ContentType": "application/json"}

    return json.dumps({"success": False}), 500, {"ContentType": "application/json"}

@app.route("/moveDragPosition") 
def move_drag_pos():
    """
    Method to move the drag position of the given todo list and save
    it in the database.
    """
    data = dict(request.headers)

    #save todo id, username, and new drag position
    print(data["Todo-Id"])
    print(int(data["Todo-Id"]))
    todo_id = int(data["Todo-Id"])
    todo_name = data["Todo-Name"]
    user_name = data["Username"]
    print(data["Newposition"])
    new_pos = eval(data["Newposition"])
    new_x = new_pos["x"]
    new_y = new_pos["y"]
    
    #move position to given new position in database
    position_dict = {"x": new_x, "y": new_y}


    #get user information via query
    user_query = {
        "username": user_name
    }

    #update the position of the todo list element in database
    todo_db_conn.users.update_one(
        user_query,
        {"$set":
            {f"todo_ids.{todo_name}.position": position_dict}
        }
    )

    return json.dumps({"success": True}), 200, {"ContentType":"application/json"}