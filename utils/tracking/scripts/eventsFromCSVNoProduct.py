import requests
import json
import csv

apiUrl = "http://localhost:3000/api/tracking/create-event"

events = []

fileName = "sheets/EventsDataNoProduct.csv"
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

for event in events:
    eventBody = {"consumerId": event[0], "trackingLocation": event[1], "action": event[2], "timestamp": event[3], "locationId": "clcxrye5u0001v4m9e959z882", "skuId": "", "itemId": ""}

    print(eventBody)

    headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
    response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

    print(response.status_code)
    # print(response._content)