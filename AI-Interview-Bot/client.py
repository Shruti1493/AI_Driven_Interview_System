import requests

# Send the request to your server
response = requests.post(
    'http://localhost:8001/rag',  
    json={'topic': 'Python'}
)

# Check if the response was successful
if response.status_code == 200:
    result = response.json()

    # Format the response by handling newlines and other formatting issues
    formatted_answer = result['answer'].replace('\\n', '\n')  # Replace escaped \n with actual newlines

    # Print the formatted result
    print("Generated Interview Questions:")
    print(formatted_answer)
else:
    print(f"Error: {response.status_code}")
# import requests

# response = requests.post(
#     'http://localhost:8001/rag',  
#     json={'topic': 'Python Programming'}
# )

# # Print the status code for debugging
# print("Response Status Code:", response.status_code)

# # Print the raw response text to see what is returned
# print("Raw Response Text:", response.text)

# if response.status_code == 200:
#     try:
#         result = response.json()  # Attempt to parse JSON response
#         print("---------------------------------------------------------")
#         print(result)
        
#         if 'ans' in result:
#             formatted_answer = result['ans']
#             print("Generated Interview Questions:")
#             print(formatted_answer)
#         else:
#             print("Error: 'ans' key not found in response")
#     except ValueError:
#         print("Error: Response content is not valid JSON")
# else:
#     print(f"Error: {response.status_code}")
