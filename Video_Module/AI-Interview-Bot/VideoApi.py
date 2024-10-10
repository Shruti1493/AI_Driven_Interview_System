from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
import dlib
from scipy.ndimage import zoom
from keras.models import load_model
from imutils import face_utils
import shutil
import os

app = FastAPI()

emotions_over_time = [] 
stress_levels_over_time = [] 

emotion_weights = {
    "Angry": 0.725,
    "Disgust": 0.5775,
    "Fear": 0.945,
    "Happy": 0.0825,
    "Sad": 0.835,
    "Surprise": 0.4125,
    "Neutral": 0.2475  
}

model = load_model('Models/video.h5')
face_detect = dlib.get_frontal_face_detector()
predictor_landmarks = dlib.shape_predictor("Models/face_landmarks.dat")

def show_video(video_path):
    global emotions_over_time
    global stress_levels_over_time

    shape_x, shape_y = 48, 48
    video_capture = cv2.VideoCapture(video_path)

    if not video_capture.isOpened():
        print("Error: Could not open video file.")
        return

    while True:
        ret, frame = video_capture.read()

        if not ret:
            print("End of video reached or error in reading frame.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = face_detect(gray, 1)

        for rect in rects:
            shape = predictor_landmarks(gray, rect)
            shape = face_utils.shape_to_np(shape)
            (x, y, w, h) = face_utils.rect_to_bb(rect)
            face = gray[y:y+h, x:x+w]
            
            face = zoom(face, (shape_x / face.shape[0], shape_y / face.shape[1]))
            face = face.astype(np.float32) / 255.0
            face = np.reshape(face, (1, 48, 48, 1))

            prediction = model.predict(face)
            emotions_over_time.append(prediction[0])
            top_three_emotions = np.argsort(prediction[0])[-3:]
            top_three_emotion_labels = [list(emotion_weights.keys())[i] for i in top_three_emotions]
            stress_level = sum(prediction[0][i] * emotion_weights[emotion] for i, emotion in zip(top_three_emotions, top_three_emotion_labels))
            stress_levels_over_time.append(stress_level)

    video_capture.release()

def summarize_results():
    global emotions_over_time, stress_levels_over_time

    emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    emotion_sums = np.zeros(7)

    for emotion_scores in emotions_over_time:
        emotion_sums += emotion_scores

    num_frames = len(emotions_over_time)
    if num_frames > 0:
        emotion_averages = emotion_sums / num_frames
    else:
        emotion_averages = emotion_sums  

    if len(stress_levels_over_time) > 0:
        mean_stress_level = sum(stress_levels_over_time) / len(stress_levels_over_time)
    else:
        mean_stress_level = 0

    result = {
        "Average Emotion Scores": {emotion: emotion_averages[i] for i, emotion in enumerate(emotion_labels)},
        "Top Three Emotions": {emotion_labels[i]: emotion_averages[i] for i in np.argsort(emotion_averages)[-3:][::-1]},
        "Mean Stress Level": mean_stress_level * 100
    }

    return result

@app.post("/upload_video/")
async def upload_video(file: UploadFile = File(...)):
    global emotions_over_time
    global stress_levels_over_time
    
    # Clear previous results
    emotions_over_time = []
    stress_levels_over_time = []

    # Save the uploaded video to a temporary location
    temp_file_path = "temp_video.mp4"
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process the video
    show_video(temp_file_path)
    # hardcoded_video_path = "recording.mp4"

    # # Process the video
    # show_video(hardcoded_video_path)


    # Summarize results
    results = summarize_results()

    # Clean up
    os.remove(temp_file_path)

    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
