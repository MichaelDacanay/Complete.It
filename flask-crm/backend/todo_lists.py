# import necessary packages
from flask import Flask, request
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
import ssl
from bson.json_util import dumps

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

@app.route("/addTodoList", methods=["POST"])
def add_todo_list():
    """
    Method to add todo list for a given user.
    """

    # save todo list information passed in from the frontend
    todo_data = eval(request.data)

    # save name of todo list
    todo_name = todo_data["todo_name"]

    # set user information to query database
    user_query = {
        "username": todo_data["username"]
    }

    # find all existing todo list ids
    global_todo_ids = list(todo_db_conn.todo_list_ids.find_one()["todo_ids"])

    # set new todo list id to the previous mximum id plus one
    new_todo_id = max(global_todo_ids)+1

    # add the new todo list id to the list of ids
    global_todo_ids.append(new_todo_id)

    # update global list of todo ids in the database
    todo_db_conn.todo_list_ids.update_one({"_id":TODO_ID_TABLE},
        {"$set": 
            {
                "todo_ids": global_todo_ids
            }
        }
    )

    # save inital x and y position
    init_x = 0
    init_y = 0

    # initially set position to (0, 0) for database insertion
    position_dict = {
        "id": int(new_todo_id),
        "position": {"x": init_x, "y": init_y}
    }

    # update the list of todo lists for that particular user
    todo_db_conn.users.update_one(
        user_query,
        {"$set":
            {f"todo_ids.{todo_name}": position_dict}
        }
    )

    # return success message if todo list was added
    return json.dumps({"success": True}), 200, {"Content-Type":"application/json"}



@app.route("/deleteTodoList", methods=["POST"])
def delete_todo_list():
    """
    Method to delete todo list for a given user.
    """

    # save user information about todo list to delete
    todo_data = eval(request.data)

    # save id, name of todo list
    todo_id = int(todo_data["todo_id"])
    todo_name = todo_data["todo_name"]

    # set user_information to query database
    user_query = {
        "username": todo_data["username"]
    }

    # update the list of todo lists for that particular user
    todo_db_conn.users.update_one(
        user_query,
        {"$unset":
            {f"todo_ids.{todo_name}": ""}
        }
    )

    # return success message if todo list was sucessfully removed
    return json.dumps({"success": True}), 200, {"Content-Type":"application/json"}