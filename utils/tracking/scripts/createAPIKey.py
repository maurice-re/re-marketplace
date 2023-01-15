import requests
import json
import csv

apiUrl = "http://localhost:3000/api/tracking/api-key"

eventBody = {"companyId": "clcxzzsn00003v4b2qj1n6lww"} # no_customer
headers = {"content-type":"application/json", "authorization": "Bearer NrL3uRqdnUsbUZs1iJbhKiYrPqS6k1RXuXWBRwjlcgyYTjxA74n3lLuySOcWUg3u"}
response = requests.post(apiUrl, data=json.dumps(eventBody), headers=headers)

print(response.status_code)