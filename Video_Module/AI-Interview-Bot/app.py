
# from flask import Flask, render_template
# from flask_socketio import SocketIO, emit
# import cv2
# import base64
# import numpy as np
# import dlib
# from math import hypot
# import io

# app = Flask(__name__)
# socketio = SocketIO(app, cors_allowed_origins="*")

# # dlib face detector and predictor initialization
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# def midpoint(p1, p2):
#     return int((p1.x + p2.x) / 2), int((p1.y + p2.y) / 2)

# def get_blinking_ratio(eye_points, facial_landmarks):
#     try:
#         left_point = (facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y)
#         right_point = (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y)
#         center_top = midpoint(facial_landmarks.part(eye_points[1]), facial_landmarks.part(eye_points[2]))
#         center_bottom = midpoint(facial_landmarks.part(eye_points[5]), facial_landmarks.part(eye_points[4]))
#         hor_line_len = hypot((left_point[0] - right_point[0]), (left_point[1] - right_point[1]))
#         ver_line_len = hypot((center_top[0] - center_bottom[0]), (center_top[1] - center_bottom[1]))
#         ratio = hor_line_len / ver_line_len
#         print(f"Blinking ratio: {ratio}")
#         return ratio
#     except Exception as e:
#         print(f"Error calculating blinking ratio: {e}")
#         return 0

# def get_gaze_ratio(eye_points, facial_landmarks, gray):
#     try:
#         left_eye_region = np.array([ 
#             (facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y),
#             (facial_landmarks.part(eye_points[1]).x, facial_landmarks.part(eye_points[1]).y),
#             (facial_landmarks.part(eye_points[2]).x, facial_landmarks.part(eye_points[2]).y),
#             (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y),
#             (facial_landmarks.part(eye_points[4]).x, facial_landmarks.part(eye_points[4]).y),
#             (facial_landmarks.part(eye_points[5]).x, facial_landmarks.part(eye_points[5]).y)
#         ], np.int32)

#         mask = np.zeros_like(gray)
#         cv2.polylines(mask, [left_eye_region], True, 255, 2)
#         cv2.fillPoly(mask, [left_eye_region], 255)
#         eye = cv2.bitwise_and(gray, gray, mask=mask)

#         min_x = np.min(left_eye_region[:, 0])
#         max_x = np.max(left_eye_region[:, 0])
#         min_y = np.min(left_eye_region[:, 1])
#         max_y = np.max(left_eye_region[:, 1])

#         gray_eye = eye[min_y:max_y, min_x:max_x]
#         _, threshold_eye = cv2.threshold(gray_eye, 70, 255, cv2.THRESH_BINARY)
#         left_side_threshold = threshold_eye[:, 0:int(threshold_eye.shape[1] / 2)]
#         right_side_threshold = threshold_eye[:, int(threshold_eye.shape[1] / 2):]

#         left_side_white = cv2.countNonZero(left_side_threshold)
#         right_side_white = cv2.countNonZero(right_side_threshold)

#         if left_side_white == 0:
#             gaze_ratio = 1
#         elif right_side_white == 0:
#             gaze_ratio = 5
#         else:
#             gaze_ratio = left_side_white / right_side_white
        
#         print(f"Gaze ratio: {gaze_ratio}")
#         return gaze_ratio
#     except Exception as e:
#         print(f"Error calculating gaze ratio: {e}")
#         return 0

# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")

# @socketio.on('disconnect')
# def handle_disconnect():
#     print("Client disconnected")

# @socketio.on('video_frame')
# def handle_video_frame(data):
#     try:
#         binary_data = base64.b64decode(data['frame'])
#         frame = cv2.imdecode(np.frombuffer(binary_data, np.uint8), cv2.IMREAD_COLOR)

#         gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#         faces = detector(gray)

#         if len(faces) == 0:
#             cv2.putText(frame, "No face detected", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
#         elif len(faces) > 1:
#             cv2.putText(frame, "Multiple faces detected", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
#         else:
#             for face in faces:
#                 landmarks = predictor(gray, face)

#                 left_eye_ratio = get_blinking_ratio([36, 37, 38, 39, 40, 41], landmarks)
#                 right_eye_ratio = get_blinking_ratio([42, 43, 44, 45, 46, 47], landmarks)
#                 blinking_ratio = (left_eye_ratio + right_eye_ratio) / 2

#                 if blinking_ratio > 5.5:
#                     cv2.putText(frame, "BLINKING", (50, 150), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)

#                 gaze_ratio = (get_gaze_ratio([36, 37, 38, 39, 40, 41], landmarks, gray) +
#                               get_gaze_ratio([42, 43, 44, 45, 46, 47], landmarks, gray)) / 2

#                 if gaze_ratio < 1:
#                     cv2.putText(frame, "RIGHT", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
#                 elif 1 < gaze_ratio < 1.7:
#                     cv2.putText(frame, "CENTER", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
#                 else:
#                     cv2.putText(frame, "LEFT", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)

#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_encoded = base64.b64encode(buffer).decode('utf-8')
#         emit('video_frame', {'frame': frame_encoded})
#     except Exception as e:
#         print(f"Error processing frame: {e}")

#     socketio.sleep(0.03)

# if __name__ == '__main__':
#     print("Starting server...")
#     socketio.run(app, host='0.0.0.0', port=5000, debug=True)


from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import base64
import numpy as np
import dlib
from math import hypot

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Dlib face detector and predictor initialization
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

def midpoint(p1, p2):
    return int((p1.x + p2.x) / 2), int((p1.y + p2.y) / 2)

def get_blinking_ratio(eye_points, facial_landmarks):
    left_point = (facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y)
    right_point = (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y)
    center_top = midpoint(facial_landmarks.part(eye_points[1]), facial_landmarks.part(eye_points[2]))
    center_bottom = midpoint(facial_landmarks.part(eye_points[5]), facial_landmarks.part(eye_points[4]))
    hor_line_len = hypot((left_point[0] - right_point[0]), (left_point[1] - right_point[1]))
    ver_line_len = hypot((center_top[0] - center_bottom[0]), (center_top[1] - center_bottom[1]))
    return hor_line_len / ver_line_len

def get_gaze_ratio(eye_points, facial_landmarks, gray):
    left_eye_region = np.array([ 
        (facial_landmarks.part(eye_points[0]).x, facial_landmarks.part(eye_points[0]).y),
        (facial_landmarks.part(eye_points[1]).x, facial_landmarks.part(eye_points[1]).y),
        (facial_landmarks.part(eye_points[2]).x, facial_landmarks.part(eye_points[2]).y),
        (facial_landmarks.part(eye_points[3]).x, facial_landmarks.part(eye_points[3]).y),
        (facial_landmarks.part(eye_points[4]).x, facial_landmarks.part(eye_points[4]).y),
        (facial_landmarks.part(eye_points[5]).x, facial_landmarks.part(eye_points[5]).y)
    ], np.int32)

    mask = np.zeros_like(gray)
    cv2.polylines(mask, [left_eye_region], True, 255, 2)
    cv2.fillPoly(mask, [left_eye_region], 255)
    eye = cv2.bitwise_and(gray, gray, mask=mask)

    min_x = np.min(left_eye_region[:, 0])
    max_x = np.max(left_eye_region[:, 0])
    min_y = np.min(left_eye_region[:, 1])
    max_y = np.max(left_eye_region[:, 1])

    gray_eye = eye[min_y:max_y, min_x:max_x]
    _, threshold_eye = cv2.threshold(gray_eye, 70, 255, cv2.THRESH_BINARY)
    left_side_threshold = threshold_eye[:, 0:int(threshold_eye.shape[1] / 2)]
    right_side_threshold = threshold_eye[:, int(threshold_eye.shape[1] / 2):]

    left_side_white = cv2.countNonZero(left_side_threshold)
    right_side_white = cv2.countNonZero(right_side_threshold)

    if left_side_white == 0:
        gaze_ratio = 1
    elif right_side_white == 0:
        gaze_ratio = 5
    else:
        gaze_ratio = left_side_white / right_side_white

    return gaze_ratio

def decode_image(binary_data):
    img_array = np.frombuffer(binary_data, dtype=np.uint8)
    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return frame

@socketio.on('video_frame')
def handle_video_frame(data):
    binary_data = base64.b64decode(data['frame'])
    frame = decode_image(binary_data)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    if len(faces) == 0:
        emit('video_status', {'message': 'Face not detected'})
    elif len(faces) > 1:
        emit('video_status', {'message': 'Multiple faces detected'})
    else:
        for face in faces:
            landmarks = predictor(gray, face)

            # Blinking detection
            left_eye_ratio = get_blinking_ratio([36, 37, 38, 39, 40, 41], landmarks)
            right_eye_ratio = get_blinking_ratio([42, 43, 44, 45, 46, 47], landmarks)
            blinking_ratio = (left_eye_ratio + right_eye_ratio) / 2

            if blinking_ratio > 5.5:
                emit('video_status', {'message': 'Blinking'})
                return

            # Gaze detection
            gaze_ratio_left_eye = get_gaze_ratio([36, 37, 38, 39, 40, 41], landmarks, gray)
            gaze_ratio_right_eye = get_gaze_ratio([42, 43, 44, 45, 46, 47], landmarks, gray)
            gaze_ratio = (gaze_ratio_left_eye + gaze_ratio_right_eye) / 2

            if gaze_ratio < 1:
                emit('video_status', {'message': 'Looking right'})
            elif 1 < gaze_ratio < 1.7:
                emit('video_status', {'message': 'Looking center'})
            else:
                emit('video_status', {'message': 'Looking left'})

    socketio.sleep(0.03)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
