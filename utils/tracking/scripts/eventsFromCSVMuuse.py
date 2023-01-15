import requests
import json
import csv

productSkuIdPairs = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}

apiUrl = "http://localhost:3000/api/tracking/create-event"

events = []

fileName = "sheets/MuuseEventDataWithDates.csv"
with open(fileName, 'r') as csvFile:
    dataReader = csv.reader(csvFile)
    next(dataReader)
    for row in dataReader:
        # The following variables correspond to the CSV column headings in the order they appear
        location = row[0] # trackingLocation is the code, locationId is in DB
        product = row[1]
        actionType = row[2]
        productId = row[3]
        date = row[4]

        # Doing this because making requests in this loop doesn't seem to work
        event = [productId, location, productSkuIdPairs[product], actionType.upper(), date]
        events.append(event)

for event in events:
    eventBody = {"consumerId": "", "itemId": event[0], "trackingLocation": event[1], "skuId": event[2], "action": event[3], "timestamp": event[4], "locationId": "219"}
    
    print(eventBody)

    # headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
    # # Actual 616: NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u
    # # Test: YWZTgtFhd9aCRjyYryWVjE7YH2fDGPSTbXba7Z4mn8VELoHSI9C4sMXjE11tEMYV
    # response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

    # print(response.status_code)