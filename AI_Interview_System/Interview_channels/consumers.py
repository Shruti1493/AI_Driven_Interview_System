
from channels.generic.websocket import WebsocketConsumer
import json
import requests

class InterviewConsumer(WebsocketConsumer):
    function_called = True   
    # questions = [] 
    questions = ["1. You mentioned working on an ML solution for anomaly detection in your  model?",

        "2.  Can you describe a project where you utiach the problem?",


        "3. In your DressMeAI project,s you encountered, and how did you overcome them?",

        "4. During your AWS Cloud internship,f a deployment issue you faced and how you resolved it?",

        "5. You have experience working with libraries l insights for better decision-making?"]
    # questions =  ['1. Can you describe a project you have worked on using Python where you had to conduct exhaustive research to identify and integrate relevant APIs? What challenges did you face during the process, and how did you overcome them?', '2. In your experience, how do you approach testing and debugging Python code, especially when dealing with complex libraries and frameworks? Can you provide an example of a time when your debugging skills were put to the test, and how you managed to find and fix the issue?', '3. You have worked on a couple of projects using the MERN stack. Can you explain how you approach frontend-backend integration in a MERN stack project and provide an example of a time when you faced a challenge during the integration process? How did you resolve the issue?', '4. You have experience working with Django Rest Framework. Can you discuss a time when you designed and implemented REST APIs, and what specific design considerations did you keep in mind to ensure scalability and maintainability of the APIs over time?', '5. You have experience working with AWS. Can you explain a situation where you had to manage the deployment of both the frontend and backend components on AWS, and what specific services or tools did you use to ensure a smooth deployment process?'] 
     
    videoResults = []
    current_question_index = 0   

    def connect(self):
        print("acccept")
        self.accept()   
    def call_function_once(self, topic):
        fastapi_url = 'http://localhost:8001/rag'   
        
        try:
       
            payload = {'topic': topic, 'file': "My-Resume/Mahek_Gupta_Resume.pdf"}  

            response = requests.post(fastapi_url, json=payload)
            response.raise_for_status()  
            answer = response.json().get('answer', '')
            print(answer)   

            if answer:
                # self.questions = [q.strip() for q in answer.split('\n') if q.strip()]
                 
                print("Extracted Questions:", self.questions)   
            else:
                self.questions = []  

        except requests.exceptions.RequestException as e:
            # Handle request errors
            self.send(text_data=json.dumps({'error': str(e)}))

    def send_next_question(self):
      
        if self.current_question_index < len(self.questions):
            question = self.questions[self.current_question_index]
            self.send(text_data=json.dumps({'question': question, 'result': self.videoResults}))
            print("count ", self.current_question_index)   
            self.current_question_index += 1  
            print("New count ", self.current_question_index)   
        else:
            self.send(text_data=json.dumps({'result': self.videoResults}))
            print("result send kya na")
            print(self.videoResults)
            # self.close()
         


 
    def post(self, video_file):
        
        if video_file:
            # Save the webm file temporarily
            webm_file_path = os.path.join('media/videos', video_file.name)
            mp4_file_path = os.path.join('media/videos', f"{os.path.splitext(video_file.name)[0]}.mp4")
            print(webm_file_path)
            print(mp4_file_path)
            print("ssjjjjjjjjjjjjjjjjjjjjjjjj")
            
            with open(webm_file_path, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            
 

    def receive(self, text_data):
        print("Received message", text_data) 
        python_data = json.loads(text_data)
         
        mess = python_data.get('client_mess', '')  # Get the client message

        upload_response = python_data.get('uploadResponse', None)
        if upload_response:
            self.videoResults.append(upload_response)
            print(f"Upload Response: {upload_response}")
            # Here you can handle the upload response as needed, for example, send a confirmation message
            self.send(text_data=json.dumps({
                'status': 'success',
                'message': 'Video uploaded successfully!',
                'uploadResponse': upload_response
            }))
       
        # Load questions if they haven't been loaded yet
        if self.function_called:
            # self.call_function_once(mess)  # Use the client message as the topic
            self.function_called = False  # Prevent multiple calls
            print("Questions loaded, sending first question...")  # Debug print
        
        # Send the next question in response to each client message
        print("Sending next question...")  
        print("current queue")
        print(self.videoResults) 
        self.send_next_question()  # Send the next question if available

    def disconnect(self, close_code):
        print("WebSocket disconnected")  
