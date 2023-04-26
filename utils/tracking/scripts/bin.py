import json
import requests

# Usage
# npm run dev
# Run using VSCode "Run" button

apiUrl = "http://localhost:3000/api/tracking/bin"

body = {"hardwareId": "1"}
headers = {"content-type":"application/json", "authorization": "Bearer DSwXumUE5eTQbYM3nI6qSPBWrtF0yp6IhjiXEVYvWMcahTyR0MWdUka1ywkWWaK8"}
response = requests.post(apiUrl, data=json.dumps(body), headers=headers)

print(response.content)
