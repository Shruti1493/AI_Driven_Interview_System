 
from flask import Flask, request, jsonify
import numpy as np
import cv2
import dlib
from scipy.ndimage import zoom
from keras.models import load_model
from imutils import face_utils
import shutil
import os
import uuid
import concurrent.futures

app = Flask(__name__)

# Emotion weights used for stress level calculation
emotion_weights = {
    "Angry": 0.725,
    "Disgust": 0.5775,
    "Fear": 0.945,
    "Happy": 0.0825,
    "Sad": 0.835,
    "Surprise": 0.4125,
    "Neutral": 0.2475  
}

# Load pre-trained model and face detection tools
model = load_model('Models/video.h5')
face_detect = dlib.get_frontal_face_detector()
predictor_landmarks = dlib.shape_predictor("Models/face_landmarks.dat")

# Function to process the video, detect emotions, and calculate stress levels
def show_video(video_path):
    shape_x, shape_y = 48, 48
    video_capture = cv2.VideoCapture(video_path)

    if not video_capture.isOpened():
        print("Error: Could not open video file.")
        return [], []

    emotions_over_time = []
    stress_levels_over_time = []

    while True:
        ret, frame = video_capture.read()

        if not ret:
            print("End of video reached or error in reading frame.")
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = face_detect(gray, 1)

        for rect in rects:
            # Extract facial landmarks
            shape = predictor_landmarks(gray, rect)
            shape = face_utils.shape_to_np(shape)
            (x, y, w, h) = face_utils.rect_to_bb(rect)
            face = gray[y:y+h, x:x+w]
            
            # Resize face to match model input
            face = zoom(face, (shape_x / face.shape[0], shape_y / face.shape[1]))
            face = face.astype(np.float32) / 255.0
            face = np.reshape(face, (1, 48, 48, 1))

            # Make emotion predictions using the model
            prediction = model.predict(face)
            emotions_over_time.append(prediction[0])

            # Get top three emotions
            top_three_emotions = np.argsort(prediction[0])[-3:]
            top_three_emotion_labels = [list(emotion_weights.keys())[i] for i in top_three_emotions]

            # Calculate stress level
            stress_level = sum(prediction[0][i] * emotion_weights[emotion] for i, emotion in zip(top_three_emotions, top_three_emotion_labels))
            stress_levels_over_time.append(stress_level)

    video_capture.release()
    return emotions_over_time, stress_levels_over_time

# Function to summarize emotion and stress analysis results
def summarize_results(emotions_over_time, stress_levels_over_time):
    emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
    emotion_sums = np.zeros(7)

    for emotion_scores in emotions_over_time:
        emotion_sums += emotion_scores

    num_frames = len(emotions_over_time)
    emotion_averages = emotion_sums / num_frames if num_frames > 0 else emotion_sums

    # Calculate the mean stress level
    mean_stress_level = sum(stress_levels_over_time) / len(stress_levels_over_time) if stress_levels_over_time else 0

    result = {
        "Average Emotion Scores": {emotion: emotion_averages[i] for i, emotion in enumerate(emotion_labels)},
        "Top Three Emotions": {emotion_labels[i]: emotion_averages[i] for i in np.argsort(emotion_averages)[-3:][::-1]},
        "Mean Stress Level": mean_stress_level * 100  # Scaling for better readability
    }

    return result

# API endpoint to upload and process video files
@app.route("/upload_video/", methods=["POST"])
def upload_video():
    # Save the uploaded video to a temporary location with a unique name
    file = request.files["file"]
    ques = request.form.get("ques")
    temp_file_path = f"temp_video_{uuid.uuid4()}.mp4"
    file.save(temp_file_path)

    print("Processing started -------------------", ques)

    # Process the video in a separate thread
    with concurrent.futures.ThreadPoolExecutor() as executor:
        emotions_over_time, stress_levels_over_time = executor.submit(show_video, temp_file_path).result()

    # Summarize and return the results
    results = summarize_results(emotions_over_time, stress_levels_over_time)

    # Clean up the temporary file
    os.remove(temp_file_path)
    print("endedddd ended -------------------", ques)


    return jsonify(results)

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)
