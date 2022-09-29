from sqlite3 import Timestamp
import requests
import json
import datetime

# CSV location == API locationId == DB trackingLocation in Event

productSkuIdPairs = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}

# Create API key for S.H.I.E.L.D
# api_url = "http://localhost:3000/api/tracking/api-key"
# api_key = {"companyId": "616", "admin": True}
# response = requests.post(api_url, json=api_key)

api_url = "http://localhost:3000/api/tracking/event"
date_handler = lambda obj: (
    obj.isoformat()
    if isinstance(obj, (datetime.datetime, datetime.date))
    else None
)

# To get timestamp with 00:00:00
# timestamp = datetime.datetime.strptime("May 25, 2022", "%B %d, %Y").strftime("%Y-%m-%d")
# timestamp = timestamp[:10] + 'T' + '00:00:00Z'

event = {"itemId": "0dff7feb-f0fc-4893-bba3-b76e207c4c4b", "locationId": "SSP-CPS", "skuId": "SB1-1-RPP-GRAY", "action": "BORROW", "timestamp": "May 25, 2022"}
headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
response = requests.post(api_url, data=json.dumps(event), headers=headers)

print(response)
print(response.content)
print(response.status_code)