import json
import requests
import inquirer # pip install inquirer
import csv

BIN = "/bin"
BORROW = "/borrow"
CAPACITY = "/capacity"
CREATE_EVENTS = "/create-events"
DELETE_EVENTS = "/delete-events"
DELETE_SETTINGS = "/delete-settings"
EDIT_EVENTS = "/edit-events"
EDIT_SETTINGS = "/edit-settings"
RETURN = "/return"

question = [
  inquirer.List('endpoint',
                message="Select endpoint to be run.",
                choices=[BIN, BORROW, CAPACITY, CREATE_EVENTS, DELETE_EVENTS, EDIT_EVENTS, RETURN],
            ),
]
answer = inquirer.prompt(question)

endpoint = answer["endpoint"]

if(endpoint == BIN):
  apiUrl = "http://localhost:3000/api/tracking/bin"

  body = {"hardwareId": "1"}
  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

  print(response.content)  
elif(endpoint == BORROW):
  apiUrl = "http://localhost:3000/api/tracking/borrow"

  body = {"consumerId": "1", "itemId": "0dff7feb-f0fc-4893-bba3-b76e207c4c4b", "hardwareId": "1", "skuId": "SB1-1-RPP-GRAY", "timestamp": "June 25, 2022"}
  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

  print(response.content)
elif(endpoint == CAPACITY):
  apiUrl = "http://localhost:3000/api/tracking/capacity"

  body = {"hardwareId": "Bp9f256Ex6yN"}
  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

  print(response.content)
elif(endpoint == CREATE_EVENTS):
  FILE_NAME = "./data/EventsDataComplete.csv"
  LOCATION_ID = "123"
  COMPANY_ID = "cl80okd2w01151c0ou3lcf386"
  HARDWARE_ID = "1"
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
      eventBody = {"consumerId": event[0], "itemId": event[1], "locationId": LOCATION_ID, "skuId": event[3], "action": event[4], "timestamp": event[5], "companyId": COMPANY_ID, "hardwareId": HARDWARE_ID}
      
      print(eventBody)

      headers = {"content-type":"application/json", "authorization": "Bearer Tq0awWGy2yeQqPfVg0wnbBFpl4taGBuyH2FQVyXLfM3rYrtkfpIGnHXs8zoea4v4"}
      response = requests.post(API_URL, data=json.dumps(eventBody), headers=headers)

      print(response.status_code)
elif(endpoint == DELETE_EVENTS):
  apiUrl = "http://localhost:3000/api/tracking/delete-events"

  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, headers=headers)

  print(response)
elif(endpoint == DELETE_SETTINGS):
  apiUrl = "http://localhost:3000/api/tracking/delete-settings"

  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, headers=headers)

  print(response)
elif(endpoint == EDIT_EVENTS):
  apiUrl = "http://localhost:3000/api/tracking/edit-events"

  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, headers=headers)

  print(response)
elif(endpoint == EDIT_SETTINGS):
    pass
elif(endpoint == RETURN):
  apiUrl = "http://localhost:3000/api/tracking/return"

  body = {"consumerId": "1", "itemId": "0dff7feb-f0fc-4893-bba3-b76e207c4c4b", "hardwareId": "1", "skuId": "SB1-1-RPP-GRAY", "timestamp": "June 25, 2022"}
  headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
  response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

  print(response.content)