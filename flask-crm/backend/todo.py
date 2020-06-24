# import necessary packages
from flask import Flask, request
import json
from pymongo import MongoClient
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

@app.route("/getTasks")
def get_tasks():
    """
    Return all to do lists and corresponding tasks for a given user.
    """

    # save username information passed in from frontend
    user_query = {
        "username":request.headers.get("Username")
    }

    # find user in database
    user_exists = todo_db_conn.users.find_one(user_query)

    # if user cannot be found in database, return unsuccessful message
    if user_exists == None:
        return json.dumps({"success":False}), 200, {"Content-Type": "application/json"}
 
    # get todo list information for user
    user_todo_lists = user_exists["todo_ids"]
    user_todo = {}
    
    # iterate through user todo lists
    for todo_list in user_todo_lists:
        
        # get todo id from user todo list
        user_todo_id = int(user_todo_lists[todo_list]["id"])

        # go through tasks belonging to that todo list
        user_todo_tasks = todo_db_conn.tasks.find({
            "todo_id": user_todo_id
        })

        # set todolist to empty
        user_todo[todo_list] = [] 

        # iterate through each task in given todo list
        for task in user_todo_tasks:

            # remove id for easier data processing
            del task["_id"]

            # try to add task to todo list
            user_todo[todo_list].append(task)
        
        # if there are no tasks for that todo list
        if len(user_todo[todo_list]) == 0:

            #set the todo id of the first element in the list to the id of
            #the todo list
            user_todo[todo_list].append(
                    {"todo_id": user_todo_id}
            )
    
    
    # return all tasks for the user's todo list
    return json.dumps(user_todo), 200, {"Content-Type":"application/json"}

@app.route('/deleteTasks', methods=["DELETE"])
def delete_tasks():
    """
    Method to delete selected tasks from user ToDo List
    """

    # save array of tasks to remove from the todo list
    remove_array = json.loads(request.headers["Remove-Array"])

    # iterate through tasks to remove from todo list
    for task in remove_array:
        
        # save each task as a dictionary
        task = dict(task)

        # remove checked attribute, since it is irrelevant to backend
        del task["checked"]

        # delete task from database
        todo_db_conn.tasks.delete_one(task)

    # return success message if task(s) were successfully deleted
    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}


@app.route('/addTask', methods=["POST"])
def add_task():
    """
    Method to add task to a user's todo list with a name and description.
    """

    # save task information passed in from the frontend
    task_data = eval(request.data)

    # try to check that task name and description are valid
    try: 
        # if task name or description are empty, return unsuccessful message
        if len(task_data["task_name"]) == 0  or len(task_data["task_description"]) == 0:
            return json.dumps({"success":False}), 200, {"Content-Type":"application/json"}

    # if there is an error in checking validity, return unsuccessful message
    except:
        return json.dumps({"success":False}), 200, {"Content-Type":"application/json"}

    # insert task information in database
    todo_db_conn.tasks.insert_one(task_data)
    
    # return success message
    return json.dumps({"success":True}), 200, {"Content-Type":"application/json"}