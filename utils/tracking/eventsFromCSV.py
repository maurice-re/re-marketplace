import requests
import json

# CSV location == API locationId == DB trackingLocation in Event

productSkuIdPairs = {"Food Container (M)":"SB1-1.5-RPP-GRAY", "Food Box (M)":"SB1-1.5-RPP-GRAY",
                    "Silver Cup (M)":"SC1-12-RPP-GRAY", "Food Container (S)": "SB1-1-RPP-GRAY"}

# Create API key for S.H.I.E.L.D
# api_url = "http://localhost:3000/api/tracking/api-key"
# api_key = {"companyId": "616", "admin": True}
# response = requests.post(api_url, json=api_key)

api_url = "http://localhost:3000/api/tracking/event"
event = {"itemId": "3458b35d-e1e8-45b8-9197-468821dbee56", "locationId": "SSP-CPS", "skuId": "SB1-1-RPP-GRAY", "action": "RETURN"}
headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
response = requests.post(api_url, data=json.dumps(event), headers=headers)

print(response)
print(response.content)
print(response.status_code)