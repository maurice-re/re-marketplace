import requests

# Usage
# npm run dev
# Run using VSCode "Run" button

apiUrl = "http://localhost:3000/api/tracking/borrow"

body = {"consumerId": "test consumerId", "itemId": "test itemId", "hardwareId": "test hardwareId", "skuId": "test skuId", "timestamp": "test timestamp", "locationId": "test locationId"}
headers = {"content-type":"application/json", s"authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
response = requests.post(apiUrl, headers=headers)

print(response)