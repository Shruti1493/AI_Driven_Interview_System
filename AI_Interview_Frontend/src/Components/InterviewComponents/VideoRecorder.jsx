import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const VideoRecorder = forwardRef((props, ref) => {
    const [recordingStatus, setRecordingStatus] = useState(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState("");
    const videoRef = useRef(null);

    const { startRecording, stopRecording } = useReactMediaRecorder({
        video: true,
        onStop: (blobUrl) => {
            setMediaBlobUrl(blobUrl);
        },
        mediaRecorderOptions: {
            mimeType: "video/webm; codecs=vp8",
        },
    });

    useImperativeHandle(ref, () => ({
        startRecording: () => {
            startRecording();
            setRecordingStatus("Answer Recording Started...");
        },
        stopAndUpload: async () => {
            stopRecording();

            setRecordingStatus("video status -> stopped and uploading...");
        },
    }));

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setRecordingStatus("Failed to access camera.");
            }
        };

        getUserMedia();
    }, []);

    useEffect(() => {
        const uploadAndHandleResponse = async () => {
            if (mediaBlobUrl) {
                await uploadVideo(mediaBlobUrl);
            }
        };

        uploadAndHandleResponse();
    }, [mediaBlobUrl]);

    const uploadVideo = async (url) => {
        if (url) {
            const videoBlob = await fetch(url).then((res) => res.blob());
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `shruti-${timestamp}.mp4`;
            const formData = new FormData();
            formData.append("video", videoBlob, fileName);

            try {
                let responseData = {
                    audio: "hello hello hello hello hello",
                    video: {
                        "Average Emotion Scores": {
                            Angry: 0.14491591606845802,
                            Disgust: 0.0033770028948593195,
                            Fear: 0.08049754124006321,
                            Happy: 0.04807277722284198,
                            Sad: 0.3077522315855684,
                            Surprise: 0.06091196170804658,
                            Neutral: 0.35447256446912373,
                        },
                        "Top Three Emotions": {
                            Neutral: 0.35447256446912373,
                            Sad: 0.3077522315855684,
                            Angry: 0.14491591606845802,
                        },
                        "Mean Stress Level": 45.27147238423254,
                    },
                };

                props.func(responseData);

                const response = await fetch(
                    "http://localhost:8000/interview/upload_video/",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const responseData = await response.json();
                    setRecordingStatus("Upload successful!");

                    return responseData;
                } else {
                    const errorMessage = await response.text();
                    setRecordingStatus("Upload failed. Please try again.");
                    return null;
                }
            } catch (error) {
                setRecordingStatus(
                    "Upload failed. Please check your connection."
                );
                return null;
            }
        } else {
            setRecordingStatus("No video recorded.");
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-     bg-gray-100  ">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    {recordingStatus}
                </h1>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-full mb-5 max-h-89 bg-black relative  rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-4/6 object-cover"
                    />
                </div>
            </div>
        </div>
    );
});

export default VideoRecorder;
