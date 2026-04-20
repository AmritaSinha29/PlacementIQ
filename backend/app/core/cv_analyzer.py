import cv2
import mediapipe as mp
import numpy as np

def analyze_body_language(video_path: str) -> int:
    """
    Processes a video file using MediaPipe FaceMesh.
    Calculates a Body Language / Focus Score (0-100) based on head pose.
    High score = looking at the camera. Low score = looking away frequently.
    """
    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("CV Analyzer Warning: Could not open video file. Defaulting to 50.")
        return 50
        
    total_frames = 0
    focused_frames = 0
    
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            break
            
        total_frames += 1
        # Skip frames to process faster (process every 5th frame)
        if total_frames % 5 != 0:
            continue
            
        # Convert the color space from BGR to RGB
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # To improve performance
        image.flags.writeable = False
        results = face_mesh.process(image)
        
        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                # Get the coordinates of key landmarks for head pose estimation
                # Nose tip
                nose_tip = face_landmarks.landmark[1]
                # Left eye center
                left_eye = face_landmarks.landmark[33]
                # Right eye center
                right_eye = face_landmarks.landmark[263]
                # Left mouth corner
                left_mouth = face_landmarks.landmark[61]
                # Right mouth corner
                right_mouth = face_landmarks.landmark[291]
                # Chin
                chin = face_landmarks.landmark[152]
                
                # Check horizontal symmetry (yaw)
                # If nose is perfectly between the eyes, user is looking straight.
                eye_dist = abs(right_eye.x - left_eye.x)
                if eye_dist == 0:
                    continue
                    
                nose_to_left = abs(nose_tip.x - left_eye.x)
                nose_to_right = abs(right_eye.x - nose_tip.x)
                
                # Ratio should be close to 1.0. If < 0.5 or > 2.0, head is turned significantly
                ratio = nose_to_left / nose_to_right if nose_to_right > 0 else 0
                
                if 0.5 < ratio < 2.0:
                    focused_frames += 1
                    
    cap.release()
    
    if total_frames == 0:
        return 50
        
    # Calculate percentage of processed frames where user was focused
    processed_count = total_frames // 5
    if processed_count == 0:
        return 50
        
    focus_percentage = (focused_frames / processed_count) * 100
    
    # Scale it to a nice 1-100 score
    score = int(focus_percentage)
    return min(100, max(0, score))
