
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import QueryInputSerializer   

   
import re
import os
import subprocess
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from moviepy.editor import VideoFileClip
import speech_recognition as sr
from .assessment_ans import evaluate, EvaluationInput
from .ans_based_ques import ans_based_ques
from .audio import run_quickstart
from django.conf import settings
from .StaticUrl import UPLOAD_VIDEO_URL
# UPLOAD_VIDEO_URL = settings.UPLOAD_VIDEO_URL


def convert_video_to_audio_moviepy(video_file, output_file):
    clip = VideoFileClip(video_file)
    clip.audio.write_audiofile(output_file)

def convert_audio_to_text(audio_file):
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
        try:
            text = r.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Audio not understood"
        except sr.RequestError as e:
            return f"Could not request results; {e}"

class VideoUploadView(APIView):
    def post(self, request):
        print("Upload video url",UPLOAD_VIDEO_URL)

        video_file = request.FILES.get('video')
        Clientquestion = request.POST.get('question')
         
        if video_file:
            # Define file paths
            webm_file_path = os.path.join('media/videos', video_file.name)
            mp4_file_path = os.path.join('media/videos', f"output_{os.path.splitext(video_file.name)[0]}.mp4")

            # Save the uploaded webm file temporarily
            with open(webm_file_path, 'wb+') as destination:
                for chunk in video_file.chunks():
                    destination.write(chunk)

            # Convert WebM to MP4 using ffmpeg
            command = [
                'ffmpeg', '-i', webm_file_path,
                '-c:v', 'libx264',
                '-c:a', 'aac',
                mp4_file_path
            ]
            subprocess.run(command, check=True)

            # Clean up the webm file after conversion
            os.remove(webm_file_path)

            # Extract audio and convert to text
            output_audio_file = "outputnew.wav"
            convert_video_to_audio_moviepy(mp4_file_path, output_audio_file)
            audio_text = convert_audio_to_text(output_audio_file)
            print("Inside views.py frunction")
        
            print("+++++++++++++++++++++++++++++++++++++++++++")


            # Clean up the audio file after extraction
            os.remove(output_audio_file)

            # Send the MP4 video to another service
            with open(mp4_file_path, 'rb') as mp4_file:
                files = {'file': mp4_file}
                data = {'ques': Clientquestion}
                # response = requests.post("http://127.0.0.1:8002/upload_video/", files=files, data=data)
                response = requests.post(UPLOAD_VIDEO_URL + "upload_video/", files=files, data=data)



                
            

            # Create the input data for evaluation
            input_data = EvaluationInput(
                # question="Explain the time complexity of merge sort.",
                # candidate_answer="Merge sort has a time complexity of O(n log n) in all cases."
                question = Clientquestion,
                candidate_answer = audio_text

            )

            # Initialize evaluation_result
            score = 0
            evaluation = None
            try:
                evaluation = evaluate(input_data) 
                
                
            except Exception as e:
                return Response({"error": f"Evaluation failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


            match = re.search(r"Relevancy Score:\s*(\d+)", evaluation)
            if match:
                relevancy_score = int(match.group(1))
                score = relevancy_score
                print("Relevancy Score:", relevancy_score)
            else:
                relevancy_score = 0
                print("Relevancy Score not found")


            # Create the response dictionary
            result_dict = {
                "Original_Ques": Clientquestion,
                "audio": audio_text,
                "video": response.json() if response.status_code == 200 else {},
                "evaluation_result": evaluation,
                "Relevancy_Score": score
            }



            # Return the response
            if response.status_code == 200:
                return Response(result_dict, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to process the video"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"error": "No video file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
