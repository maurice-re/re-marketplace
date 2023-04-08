import requests
import json
import csv

# Usage
# npm run dev
# Use API key for the desired company in "Bearer ..." (create new API Key using createAPIKey.py if needed)
# Change FILE_NAME and LOCATION_ID
# Run using VSCode "Run" button in Python terminal, cd'ing into this directory
# Ensure CSV column order is: customer,location,product,type,productId,date

FILE_NAME = "../../sheets/EventsDataComplete.csv"
LOCATION_ID = "13"
PRODUCT_TO_SKU_ID = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}
API_URL = "http://localhost:3000/api/tracking/create-event"

events = []

with open(FILE_NAME, 'r') as csvFile:
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
        event = [customer, productId, location, PRODUCT_TO_SKU_ID[product], actionType.upper(), date]
        events.append(event)

for event in events:
    eventBody = {"consumerId": event[0], "itemId": event[1], "locationId": LOCATION_ID, "skuId": event[3], "action": event[4], "timestamp": event[5], "companyId": "14"}
    
    print(eventBody)

    headers = {"content-type":"application/json", "authorization": "Bearer Tq0awWGy2yeQqPfVg0wnbBFpl4taGBuyH2FQVyXLfM3rYrtkfpIGnHXs8zoea4v4"}
    response = requests.post(API_URL, data=json.dumps(eventBody), headers=headers)

    print(response.status_code)
