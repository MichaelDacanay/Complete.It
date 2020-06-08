#imports
from flask import Flask, request
import json
from pymongo import MongoClient

#import flask app
from __main__ import app

CONN_STRING = ""
with open("credentials.json", "r") as data:
    CONN_STRING = json.load(data)["connectionStr"]

#connect to db
todo_db_conn = MongoClient(CONN_STRING)["ToDo"]

@app.route("/getTasks")
def get_tasks():
    """
    Return all to do lists and corresponding tasks for a given user.
    """
    #get username from frontend
    user_query = {
        "username":request.headers.get("Username")
    }
    #get user
    user_exists = todo_db_conn.users.find_one(user_query)
    if user_exists == None:
        return json.dumps({"success":False}), 200, {"Content-Type": "application/json"}

    #get data for user
    user_todo_lists = user_exists["todo_ids"]
    user_todo = {}
    
    #iterate through user todo lists
    for todo_list in user_todo_lists:
        
        #go through tasks belonging to that todo list
        user_todo_tasks = todo_db_conn.tasks.find({
            "todo_id": user_todo_lists[todo_list]
        })

        #set todolist to empty
        user_todo[todo_list] = [] 

        #iterate through each task in given todo list
        for task in user_todo_tasks:
            del task["_id"]
            #try to add task to todo list
            user_todo[todo_list].append(task)
    
    #print(f"Getting for {user_query}")
    #print(f"{user_todo}")
    return json.dumps(user_todo), 200, {"Content-Type":"application/json"}

@app.route('/deleteTasks', methods=["DELETE"])
def delete_tasks():
    """
    Method to delete selected tasks from user ToDo List
    """
    remove_array = json.loads(request.headers["Remove-Array"])

    #iterate through tasks to remove
    for task in remove_array:
        print(task)
        task = dict(task)
        del task["checked"]

        #delete task from mongo db
        todo_db_conn.tasks.delete_one(task)

    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}


@app.route('/addTask', methods=["POST"])
def add_task():
    """
    Method to add task to a user's todo list with a name and description.
    """
    task_data = eval(request.data)

    try: 
        if len(task_data["task_name"])==0  or len(task_data["task_description"])==0:
            return json.dumps({"success":False}), 200, {"Content-Type":"application/json"}
    except:
        return json.dumps({"success":False}), 200, {"Content-Type":"application/json"}

    #add task to mongodb
    todo_db_conn.tasks.insert_one(task_data)
    
    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}