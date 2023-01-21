import requests
import json
import csv

# Usage
# npm run dev
# Use API key for the desired company in "Bearer ..." (create new API Key using createAPIKey.py if needed)
# Change fileName
# Run using VSCode "Run" button in Python terminal, cd'ing into this directory
# Ensure CSV column order is: customer,location,product,type,productId,date

productSkuIdPairs = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}

apiUrl = "http://localhost:3000/api/tracking/create-event"

events = []

fileName = "../../sheets/EventsDataNoReturn.csv"
with open(fileName, 'r') as csvFile:
    dataReader = csv.reader(csvFile)
    next(dataReader)
    for row in dataReader:
        # The following variables correspond to the CSV column headings in the order they appear
        customer = row[0]
        location = row[1] # trackingLocation is the code, locationId is in DB
        product = row[2]
        actionType = row[3]
        productId = row[4]
        date = row[5]

        # Doing this because making requests in this loop doesn't seem to work
        event = [customer, productId, location, productSkuIdPairs[product], actionType.upper(), date]
        events.append(event)

for event in events:
    eventBody = {"consumerId": event[0], "itemId": event[1], "trackingLocation": event[2], "skuId": event[3], "action": event[4], "timestamp": event[5], "locationId": "clcxz3gab0002v4b2li9smsoz"}
    
    print(eventBody)

    headers = {"content-type":"application/json", "authorization": "Bearer Tq0awWGy2yeQqPfVg0wnbBFpl4taGBuyH2FQVyXLfM3rYrtkfpIGnHXs8zoea4v4"}
    response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

    print(response.status_code)