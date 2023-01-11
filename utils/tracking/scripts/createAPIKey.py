import requests
import json
import csv

apiUrl = "http://localhost:3000/api/tracking/api-key"

eventBody = {"companyId": "clcr7jr5r0002v4bybxoznk72"} # no_product
headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

print(response.status_code)