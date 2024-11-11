 
from channels.generic.websocket import WebsocketConsumer
import json
import requests
import os
from .rag import QueryInput,generateQuestions
import time



class InterviewConsumer(WebsocketConsumer):
    function_called = True
   
    videoResults = []
    questions = []
    current_question_index = 0

    def connect(self):
        self.videoResults = []
        self.questions = []
        print("Wile connectinh")
        print(len(self.videoResults))
        print(len(self.questions))
        
        self.accept()

    

    def call_function_once(self, file_path):
        # file_path = r"C:\Users\91937\Desktop\Major_Project_MONGODB\AI_Interview_System\Uploaded_resumes\SHRUTI KEDARI RESUME.pdf"
        # file_path = r"C:\Users\91937\Desktop\Major_Project_MONGODB\AI-Interview-Bot\My-Resume\New_Resume_of_Shruti (2).pdf"
 
        
        input_data = QueryInput(topic="Python", file=file_path)
         
        ques = generateQuestions(input_data)
        print("_-----------------------------_")
        print(ques)
        
        print("_-----------------------------_")
        ques = {'answer': "1. Can you share a specific Python project you worked on and describe the problem you were trying to solve? What was the most challenging part of the project, and how did you overcome it?\n        2. You have mentioned developing a backend for a web portal offering internships to students. Can you walk me through the process of designing and implementing the REST APIs for this project?"}
        # \n        3. In your experience, how have you optimized the performance of your Python code to ensure efficient handling of large volumes of data? Can you provide an example?\n        4. You've worked with Django Rest Framework. Can you describe a scenario where you encountered an error"}
        if ques:
            self.questions = [q.strip() for q in ques['answer'].split('\n') if q.strip()]
            print("Extracted Questions:", self.questions)
            self.videoResults = []

        else:
            self.questions = ["No questions generated"]






    def send_next_question(self):
        print("Inside send next question")
        if self.current_question_index < len(self.questions):
            question = self.questions[self.current_question_index]
            self.send(text_data=json.dumps({'question': question, 'result': self.videoResults}))
            self.current_question_index += 1
   





    def receive(self, text_data):
        python_data = json.loads(text_data)
        mess = python_data.get('client_mess', '')
        upload_response = python_data.get('result', '')
       
        resume_path = python_data.get('resume', '')
        print("9393939", resume_path)

        if upload_response:
            self.videoResults.append(upload_response)
            for i, res in enumerate(self.videoResults):
                print(i, " => ", res)
            

            print(len(self.videoResults))
            print(len(self.questions))
            if len(self.videoResults) >= len(self.questions):
                print("Inside second for loop")
                self.send(text_data=json.dumps({'FinalResult': self.videoResults}))

        if resume_path:
            print("Resume path inside receive func ",resume_path)
            if self.function_called:
                self.call_function_once(resume_path)  
                self.function_called = False
                self.send_next_question()
        

        if mess:
            self.send_next_question()





    def disconnect(self, close_code):
        self.videoResults = []
        self.questions = []
        print(len(self.videoResults))
        print(len(self.questions))
        if len(self.videoResults) != len(self.questions):
            print("Waiting for all results to be received before disconnecting.")
        else:
            print("WebSocket disconnected")




# daphne AI_Interview_System.asgi:application