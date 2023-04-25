import inquirer # pip install inquirer

BIN = "/bin"
BORROW = "/borrow"
CAPACITY = "/capacity"
CREATE_EVENTS = "/create-events"
DELETE_EVENTS = "/delete-events"
EDIT_EVENTS = "/edit-events"
RETURN = "return"

question = [
  inquirer.List('endpoint',
                message="Select endpoint to be run.",
                choices=[BIN, BORROW, CAPACITY, CREATE_EVENTS, DELETE_EVENTS, EDIT_EVENTS, RETURN],
            ),
]
answer = inquirer.prompt(question)

endpoint = answer["endpoint"]

if(endpoint == BIN):
    pass
elif(endpoint == BORROW):
    pass
