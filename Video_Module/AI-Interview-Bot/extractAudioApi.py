import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from moviepy.editor import VideoFileClip
import speech_recognition as sr

app = FastAPI()

# def convert_video_to_audio_moviepy(video_file: str, output_file: str):
#     clip = VideoFileClip(video_file)
#     clip.audio.write_audiofile(output_file)

# def convert_audio_to_text(audio_file: str) -> str:
#     r = sr.Recognizer()
#     with sr.AudioFile(audio_file) as source:
#         audio = r.record(source)
#         text = r.recognize_google(audio)
#         return text

# @app.post("/convert/")
# async def convert_video(video: UploadFile = File(...)):
#     # Save the uploaded video file
#     f"output_{os.path.splitext(video_file.name)[0]}.mp4"
   

#     # input_video_file = f"C:/Users/1937/Desktop/Major_Project_MONGODB/AI_Interview_System/media/videos/{video.file}"
#     # output_audio_file = f"uploads/output1.wav"
#     input_video_file = "output_shruti-2024-10-09T04-54-06-621Z.mp4"
#     output_audio_file = "outputnew.wav"

#     # Create uploads directory if it doesn't exist
#     os.makedirs("uploads", exist_ok=True)

#     # Write the video file to disk
#     with open(input_video_file, "wb") as buffer:
#         buffer.write(await video.read())

#     try:
#         # Convert video to audio
#         convert_video_to_audio_moviepy(input_video_file, output_audio_file)

#         # Convert audio to text
#         transcription = convert_audio_to_text(output_audio_file)
#         print("Trabsicption")
#         print(transcription)

#         return JSONResponse(content={"transcription": transcription})

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:
#         # Clean up: remove files after processing
#         if os.path.exists(input_video_file):
#             os.remove(input_video_file)
#         if os.path.exists(output_audio_file):
#             os.remove(output_audio_file)

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8003)

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


@app.post("/convert/")
async def read_root():
    input_video_file = "output_shruti-2024-10-09T04-54-06-621Z.mp4"
    output_audio_file = "outputnew.wav"
    
    convert_video_to_audio_moviepy(input_video_file, output_audio_file)
    convert_audio_to_text(output_audio_file)

    
    return {"message": "Hello, World!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8003)   

