import os
from google.cloud import speech
from pydub import AudioSegment
from google.cloud import speech_v1p1beta1 as speech

# Set the Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\91937\\Desktop\\Major_Project_MONGODB\\AI_Interview_System\\Interview_channels\\outstanding-map-441316-t4-60b6cb23494e.json"


def convert_to_mono(input_path, output_path):
    """
    Converts the audio file to mono (1 channel) and exports it as a WAV file.
    """
    try:
        audio = AudioSegment.from_wav(input_path)
        mono_audio = audio.set_channels(1)  # Convert to mono
        mono_audio.export(output_path, format="wav")  # Export to new file
        print(f"Audio converted to mono and saved to {output_path}")
    except Exception as e:
        print(f"Error during audio conversion to mono: {e}")
        raise


def resample_audio(input_path, output_path, target_sample_rate=48000):
    """
    Resamples an audio file to the target sample rate.
    """
    try:
        # Convert to mono first, then resample
        temp_mono_audio = "temp_mono_audio.wav"
        convert_to_mono(input_path, temp_mono_audio)

        audio = AudioSegment.from_wav(temp_mono_audio)
        audio = audio.set_frame_rate(target_sample_rate)  # Resample to the target sample rate
        audio.export(output_path, format="wav")  # Export to final WAV file
        print(f"Audio resampled and saved to {output_path}")
    except Exception as e:
        print(f"Error during audio resampling: {e}")
        raise


def run_quickstart(input_audio_file):
    """
    Processes the given audio file and sends it to Google Speech-to-Text API.
    """
    # Path to the resampled audio file
    resampled_audio_file = "outputnewvoice.wav"

    try:
        # Resample the audio file
        resample_audio(input_audio_file, resampled_audio_file)

        client = speech.SpeechClient()

        with open(resampled_audio_file, "rb") as audio_file:
            content = audio_file.read()

        audio = speech.RecognitionAudio(content=content)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=48000,  # Ensure this matches the resampled rate
            language_code="en-US",
        )

        response = client.recognize(config=config, audio=audio)

        # Process and print the response
        for result in response.results:
            transcript = result.alternatives[0].transcript
            print("Transcript:", transcript)

            # Call filler words detection
            filler_words_detection(transcript)

        return response
    except Exception as e:
        print(f"Error during audio processing or API call: {e}")
        raise


def filler_words_detection(transcript):
    """
    Detects filler words in the given transcript.
    """
    filler_words = [
        "um", "uh", "umm", "uhh", "er", "ah", "hmm",
        "like", "you know", "i mean", "basically", "actually", "so", "well",
        "okay", "right", "alright", "yeah", "nope", "yep", "oh", "huh", "hmm",
        "sort of", "kind of", "just", "literally", "totally", "really",
        "anyway", "obviously", "probably", "maybe", "perhaps",
        "you see", "you know what I mean", "or something",
        "as in", "whatever", "like I said", "I guess", "at the end of the day",
        "to be honest", "TBH", "I feel like", "to be fair", "kinda", "sorta",
        "know what I mean", "uh huh", "yeah yeah", "like I said earlier",
        "and stuff", "and things", "or whatever", "basically speaking",
        "in a way", "in some sense", "you get me", "got it", "know what I'm saying"
    ]

    detected_filler_words = [word for word in filler_words if word in transcript.lower()]
    if detected_filler_words:
        print("Filler words detected:")
        print(f"Detected filler words: {', '.join(detected_filler_words)}")
    else:
        print("No filler words detected.")
