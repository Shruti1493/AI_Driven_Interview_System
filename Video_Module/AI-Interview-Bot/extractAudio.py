import os
from moviepy.editor import VideoFileClip
import speech_recognition as sr

def convert_video_to_audio_moviepy(video_file, output_file):
    clip = VideoFileClip(video_file)
    clip.audio.write_audiofile(output_file)


def convert_audio_to_text(audio_file):
    r = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = r.record(source)
        text = r.recognize_google(audio)
        print("Test print kar")
        print(text)

if __name__ == "__main__":
    # input_video_file = "video2.mp4" 
    # output_audio_file = "output1.wav"  

    input_video_file = "output_shruti-2024-10-09T04-54-06-621Z.mp4"
    output_audio_file = "outputnew.wav"
    
    convert_video_to_audio_moviepy(input_video_file, output_audio_file)
    convert_audio_to_text(output_audio_file)

