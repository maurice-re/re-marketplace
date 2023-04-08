import json
import requests

# Usage
# npm run dev
# Run using VSCode "Run" button

apiUrl = "http://localhost:3000/api/tracking/return"

body = {"consumerId": "1", "itemId": "0dff7feb-f0fc-4893-bba3-b76e207c4c4b", "hardwareId": "1", "skuId": "SB1-1-RPP-GRAY", "timestamp": "June 25, 2022"}
headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

print(response.content)