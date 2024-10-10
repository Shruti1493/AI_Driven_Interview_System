import numpy as np
import pandas as pd
import cv2
from scipy.ndimage import zoom
from scipy.spatial import distance
from scipy import ndimage
import dlib
import tensorflow as tf
from keras.models import load_model
from imutils import face_utils
import matplotlib.pyplot as plt


emotions_over_time = []
stress_levels_over_time = [] 


def show_video(video_path):

    global emotions_over_time
    global stress_levels_over_time
    shape_x = 48
    shape_y = 48

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

    audio_frames = []
    video_closed = False

    video_capture = cv2.VideoCapture(video_path)

    if not video_capture.isOpened():
        print("Error: Could not open video file.")
        return

    while True:
        ret, frame = video_capture.read()

        if not ret:
            print("End of video reached or error in reading frame.")
            break

        face_index = 0
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = face_detect(gray, 1)

        for (i, rect) in enumerate(rects):

            shape = predictor_landmarks(gray, rect)
            shape = face_utils.shape_to_np(shape)

            (x, y, w, h) = face_utils.rect_to_bb(rect)
            face = gray[y:y+h, x:x+w]

            face = zoom(face, (shape_x / face.shape[0], shape_y / face.shape[1]))

            face = face.astype(np.float32)

            face /= float(face.max())
            face = np.reshape(face.flatten(), (1, 48, 48, 1))

            prediction = model.predict(face)
            prediction_result = np.argmax(prediction)

            top_three_emotions = np.argsort(prediction[0])[-3:]
            top_three_emotion_labels = [list(emotion_weights.keys())[i] for i in top_three_emotions]
            stress_level = sum(prediction[0][i] * emotion_weights[emotion] for i, emotion in zip(top_three_emotions, top_three_emotion_labels))

            emotions_over_time.append(prediction_result)
            stress_levels_over_time.append(stress_level)

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, "Stress Level: {:.2f}%".format(stress_level * 100), (frame.shape[1] - 200, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

         

            cv2.putText(frame, "----------------", (40, 100 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 0)
            cv2.putText(frame, "Emotional report : Face #" + str(i + 1), (40, 120 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 0)
            cv2.putText(frame, "Angry : " + str(round(prediction[0][0], 3)), (40, 140 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 0)
            cv2.putText(frame, "Disgust : " + str(round(prediction[0][1], 3)), (40, 160 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 0)
            cv2.putText(frame, "Fear : " + str(round(prediction[0][2], 3)), (40, 180 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 1)
            cv2.putText(frame, "Happy : " + str(round(prediction[0][3], 3)), (40, 200 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 1)
            cv2.putText(frame, "Sad : " + str(round(prediction[0][4], 3)), (40, 220 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 1)
            cv2.putText(frame, "Surprise : " + str(round(prediction[0][5], 3)), (40, 240 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 1)
            cv2.putText(frame, "Neutral : " + str(round(prediction[0][6], 3)), (40, 260 + 180 * i), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 155, 1)

            emotion_labels = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
            cv2.putText(frame, emotion_labels[prediction_result], (x + w - 10, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.putText(frame, 'Number of Faces : ' + str(len(rects)), (40, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, 155, 1)
        cv2.imshow('Video', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    video_capture.release()
    cv2.destroyAllWindows()

def main():
    global emotions_over_time
    video_path = 'video3.mp4'  
    show_video(video_path)

    emotion_dict = {
        0: "Angry",
        1: "Disgust",
        2: "Fear",
        3: "Happy",
        4: "Sad",
        5: "Surprise",
        6: "Neutral"
    }
    emotion_counts = {}
    for emotion in emotions_over_time:
        if emotion in emotion_counts:
            emotion_counts[emotion] += 1
        else:
            emotion_counts[emotion] = 1

    sorted_emotions = sorted(emotion_counts, key=emotion_counts.get, reverse=True)

    top_three_emotions = []
    for emotion in sorted_emotions:
        if len(top_three_emotions) < 3 and emotion not in top_three_emotions:
            top_three_emotions.append(emotion_dict[emotion])

    if len(top_three_emotions) < 3:
        print("Top Unique Emotions Detected:", top_three_emotions)
    else:
        print("Top Three Unique Emotions Detected:", top_three_emotions)

    if len(stress_levels_over_time) == 0:
        mean_stress_level = 0
    else:
        mean_stress_level = sum(stress_levels_over_time) / len(stress_levels_over_time)
    print("Mean Stress Level: {:.2f}%".format(mean_stress_level * 100))

if __name__ == "__main__":
    main()
