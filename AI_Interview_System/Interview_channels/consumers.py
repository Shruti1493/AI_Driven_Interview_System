 
from channels.generic.websocket import WebsocketConsumer
import json
import requests
import os

class InterviewConsumer(WebsocketConsumer):
    function_called = True
    questions = [
        "1. You mentioned working on an ML model?",
        "2. Can you describe a project where you implemented machine learning?",
       
    ]
    
    #  "3. In your DressMeAI project, what challenges did you encounter, and how did you overcome them?",
    videoResults = []
    current_question_index = 0

    def connect(self):
        self.accept()

    def call_function_once(self, topic):
        fastapi_url = 'http://localhost:8001/rag'
        try:
            payload = {'topic': topic, 'file': "My-Resume/Mahek_Gupta_Resume.pdf"}
            response = requests.post(fastapi_url, json=payload)
            response.raise_for_status()
            answer = response.json().get('answer', '')

            if answer:
                print("Extracted Questions:", self.questions)
            else:
                self.questions = []

        except requests.exceptions.RequestException as e:
            self.send(text_data=json.dumps({'error': str(e)}))






    def send_next_question(self):
        if self.current_question_index < len(self.questions):
            question = self.questions[self.current_question_index]
            self.send(text_data=json.dumps({'question': question, 'result': self.videoResults}))
            self.current_question_index += 1
        else:
            self.send(text_data=json.dumps({'FinalResult': self.videoResults}))


 






    def receive(self, text_data):
        python_data = json.loads(text_data)
        mess = python_data.get('client_mess', '')
        upload_response = python_data.get('result', '')

        if upload_response:
            self.videoResults.append(upload_response)
            for i, res in enumerate(self.videoResults):
                print(i, " => ", res)

        if self.function_called:
            self.function_called = False

        if mess:
            self.send_next_question()





    def disconnect(self, close_code):
        print("WebSocket disconnected")
