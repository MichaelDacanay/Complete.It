#imports
from flask import Flask, request
import json
from pymongo import MongoClient
from bson.objectid import ObjectId
import ssl
from bson.json_util import dumps

#import flask app
from __main__ import app

CONN_STRING = ""
with open("credentials.json", "r") as data:
    CONN_STRING = json.load(data)["connectionStr"]

#connect to db
todo_db_conn = MongoClient(CONN_STRING, ssl_cert_reqs=ssl.CERT_NONE)["ToDo"]
TODO_ID_TABLE = ObjectId("5ee0274c7c71c6a064dd056c")

@app.route("/addTodoList", methods=["POST"])
def add_todo_list():
    """
    Method to add todo list for a given user.
    """
    todo_data = eval(request.data)
    #name of todo list
    todo_name = todo_data["todo_name"]

    #set user_query to fin duser
    user_query = {
        "username": todo_data["username"]
    }

    #find all existing todo list ids
    global_todo_ids = list(todo_db_conn.todo_list_ids.find_one()["todo_ids"])

    #set new id to max +1
    new_todo_id = max(global_todo_ids)+1
    global_todo_ids.append(new_todo_id)

    #update global list of todo ids with new ID
    todo_db_conn.todo_list_ids.update_one({"_id":TODO_ID_TABLE},
        {"$set": 
            {
                "todo_ids": global_todo_ids
            }
        }
    )

    #inital x and y position
    init_x = 0
    init_y = 0

    #initially set position to (0, 0)
    position_dict = {
        "id": int(new_todo_id),
        "position": {"x": init_x, "y": init_y}
    }

    #update the list of todo lists for that particular user
    todo_db_conn.users.update_one(
        user_query,
        {"$set":
            {f"todo_ids.{todo_name}": position_dict}
        }
    )

    return json.dumps({"success": True}), 200, {"Content-Type":"application/json"}



@app.route("/deleteTodoList", methods=["POST"])
def delete_todo_list():
    """
    Method to delete todo list for a given user.
    """
    todo_data = eval(request.data)
    #name of todo list
    todo_id = int(todo_data["todo_id"])
    todo_name = todo_data["todo_name"]

    #set user_query to fin duser
    user_query = {
        "username": todo_data["username"]
    }

    #find all existing todo list ids
    global_todo_ids = list(todo_db_conn.todo_list_ids.find_one()["todo_ids"])

    #remove given todo id from list
    global_todo_ids.remove(todo_id)

    #update global list of todo ids with new ID
    todo_db_conn.todo_list_ids.update_one({"_id":TODO_ID_TABLE},
        {"$set": 
            {
                "todo_ids": global_todo_ids
            }
        }
    )

    #update the list of todo lists for that particular user
    todo_db_conn.users.update_one(
        user_query,
        {"$unset":
            {f"todo_ids.{todo_name}": ""}
        }
    )

    return json.dumps({"success": True}), 200, {"Content-Type":"application/json"}