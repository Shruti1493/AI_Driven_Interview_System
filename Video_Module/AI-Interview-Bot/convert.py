from moviepy.editor import VideoFileClip

# Load the .webm file
clip = VideoFileClip("C:\\Users\\Deepali\\Desktop\\Video\\video2.webm")

# Write the result as .mp4
clip.write_videofile("C:\\Users\\Deepali\\Desktop\\Video\\output_file.mp4")
