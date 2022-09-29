from sqlite3 import Timestamp
import requests
import json
import datetime
import csv

productSkuIdPairs = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}

apiUrl = "http://localhost:3000/api/tracking/event"

# To get timestamp with 00:00:00
# timestamp = datetime.datetime.strptime("May 25, 2022", "%B %d, %Y").strftime("%Y-%m-%d")
# timestamp = timestamp[:10] + 'T' + '00:00:00Z'

# To create test event
# event = {"itemId": "0dff7feb-f0fc-4893-bba3-b76e207c4c4b", "locationId": "SSP-CPS", "skuId": "SB1-1-RPP-GRAY", "action": "BORROW", "timestamp": "Sep 25, 2022"}
# headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
# response = requests.post(apiUrl, data=json.dumps(event), headers=headers)

events = []

fileName = "MuuseEventDataWithDates.csv"
with open(fileName, 'r') as csvFile:
    dataReader = csv.reader(csvFile)
    next(dataReader)
    for row in dataReader:
        location = row[0]
        product = row[1]
        actionType = row[2]
        productId = row[3]
        date = row[4]

        # Doing this because making requests in this loop doesn't seem to work
        event = [productId, location, productSkuIdPairs[product], actionType.upper(), date]
        events.append(event)

for event in events:
    print(event)

    eventBody = {"itemId": event[0], "locationId": event[1], "skuId": event[2], "action": event[3], "timestamp": event[4]}
    headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
    response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

    print(response.status_code)