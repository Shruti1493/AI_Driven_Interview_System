 
from channels.generic.websocket import WebsocketConsumer
import json
import requests
import os
from .rag import QueryInput,generateQuestions



class InterviewConsumer(WebsocketConsumer):
    function_called = True
   
    videoResults = []
    questions = []
    current_question_index = 0

    def connect(self):
        self.accept()

    

    def call_function_once(self, topic):
        
        file_path = r"C:\Users\91937\Desktop\Major_Project_MONGODB\AI-Interview-Bot\My-Resume\New_Resume_of_Shruti (2).pdf"

        input_data = QueryInput(topic=topic, file=file_path)

        ques = generateQuestions(input_data)
        
        print(ques)

        if ques:
            self.questions = [q.strip() for q in ques['answer'].split('\n') if q.strip()]
            print("Extracted Questions:", self.questions)
        else:
            self.questions = ["No questions generated"]






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
            self.call_function_once(mess)  
            self.function_called = False

        if mess:
            self.send_next_question()





    def disconnect(self, close_code):
        print("WebSocket disconnected")
