import requests

# Define the request data
data = {
    'question': 'You mentioned working on an ML solution for anomaly detection in your internship at General Mills. Can you elaborate on the two key indicators you used to categorize anomalies and the methodology you employed to ensure the accuracy of your model?',
    'candidate_answer': 'during my internship at general Mills had developed and ml solution for anomaly detection achieving 80% of accuracy on a real time data set using accuracy and conformity as the key indicator for categorising anomalies'
}

# Send the POST request to the FastAPI server
response = requests.post('http://127.0.0.1:8005/evaluate', json=data)

# Check the response status and handle the output accordingly
if response.status_code == 200:
    result = response.json()  # Parse the JSON response
    print(result)
    
else:
    print(f"Error: {response.status_code}, Message: {response.text}")