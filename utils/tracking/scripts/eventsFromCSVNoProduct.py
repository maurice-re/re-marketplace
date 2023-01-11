import requests
import json
import csv

apiUrl = "http://localhost:3000/api/tracking/create-event"

events = []

fileName = "EventsDataNoProduct.csv"
with open(fileName, 'r') as csvFile:
    dataReader = csv.reader(csvFile)
    next(dataReader)
    for row in dataReader:
        # The following variables correspond to the CSV column headings in the order they appear
        customer = row[0]
        location = row[1]
        actionType = row[2]
        date = row[3]

        # Doing this because making requests in this loop doesn't seem to work
        event = [customer, location, actionType.upper(), date]
        events.append(event)

# for event in events:
event=events[0]

print(event)

eventBody = {"consumerId": event[0], "locationId": event[1], "action": event[2], "timestamp": event[3]}
headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

# print(eventBody)
# print(response._content)
print(response.status_code)