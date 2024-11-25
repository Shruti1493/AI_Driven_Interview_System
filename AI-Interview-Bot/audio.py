import os
from google.cloud import speech

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\91937\\Desktop\\Major_Project_MONGODB\\AI-Interview-Bot\\outstanding-map-441316-t4-60b6cb23494e.json"

def run_quickstart() -> speech.RecognizeResponse:
    client = speech.SpeechClient()

    local_audio_file = "C:\\Users\\91937\\Desktop\\Major_Project_MONGODB\\AI-Interview-Bot\\record_out.wav"

    with open(local_audio_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    for result in response.results:
        print(f"Transcript: {result.alternatives[0].transcript}")
        filler_words_detection(result.alternatives[0].transcript)


def filler_words_detection(result):
    filler_words = [
    "um", "uh", "umm","uhh","like", "you know", "i mean", "basically", "actually", "so", 
    "well", "okay", "right", "alright", "yeah", "hmm", "sort of", "kind of", 
    "just", "literally", "totally", "really", "anyway", "obviously", 
    "basically", "probably", "you see", "you know what I mean", "or something"]
    
    if any(word in result for word in filler_words):
        print("Filler words detected")
        detected_filler_words = [word for word in filler_words if word in result]
        print(f"Detected filler words: {', '.join(detected_filler_words)}")

    
    

if __name__ == "__main__":  
    run_quickstart()