import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import io from "socket.io-client";
import { VIDEO_PATH, API_BASE_URL,SOCKET_IO_BASEPATH } from "../../config.js"


const VideoRecorder = forwardRef((props, ref) => {
    const [recordingStatus, setRecordingStatus] = useState(null);
    const [backendMessage, setBackendMessage] = useState(""); // Store backend messages
    const [mediaBlobUrl, setMediaBlobUrl] = useState("");
    const [question, setQuestion] = useState(null);
    const [socket, setSocket] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const { startRecording, stopRecording } = useReactMediaRecorder({
        video: true,
        onStop: (blobUrl) => {
            console.log("Recording stopped. Blob URL:", blobUrl); // Debug statement
            setMediaBlobUrl(blobUrl);
        },
        mediaRecorderOptions: {
            mimeType: "video/webm; codecs=vp8",
        },
    });

    useImperativeHandle(ref, () => ({
        startRecording: () => {
            console.log("Starting recording..."); // Debug statement
            startRecording();
            setRecordingStatus("Answer Recording Started...");
        },
        stopAndUpload: async (ques) => {
            console.log("Stopping recording..."); // Debug statement
            stopRecording();
            setQuestion(ques);
            setRecordingStatus("");
            if (socket) {
                console.log("Disconnecting socket..."); // Debug statement
                socket.disconnect();
                setSocket(null);
            }
        },
    }));

    useEffect(() => {
        const getUserMedia = async () => {
            try {
                console.log("Requesting user media..."); // Debug statement
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                if (videoRef.current) {
                    console.log("User media granted, setting video source..."); // Debug statement
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.log("Failed to access camera:", err); // Debug statement
                setRecordingStatus("Failed to access camera.");
            }
        };

        getUserMedia();
    }, []);

    useEffect(() => {
        if (recordingStatus === "Answer Recording Started...") {
            console.log(
                "Answer recording started, establishing WebSocket connection..."
            ); // Debug statement
            const newSocket = io(SOCKET_IO_BASEPATH);
            setSocket(newSocket);

            const sendFrame = () => {
                if (videoRef.current && canvasRef.current) {
                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");

                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;

                    context.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    const frame = canvas.toDataURL("image/jpeg");
                    const binaryFrame = frame.split(",")[1]; // Remove the data URL prefix

                    console.log("Sending frame to backend..."); // Debug statement
                    if (newSocket) {
                        newSocket.emit("video_frame", { frame: binaryFrame });
                    }
                }
            };

            newSocket.on("message", (message) => {
                console.log("Message from backend:", message); // Debug statement
                setBackendMessage(message); // Update the backend message state
            });

            // Listen for video_status event from backend
            newSocket.on("video_status", (data) => {
                console.log("Video status from backend:", data.message); // Debug statement
                setBackendMessage(data.message); // Update the backend message state
            });

            const intervalId = setInterval(sendFrame, 100); // Send frame every 100ms
            console.log("Frame sending interval established..."); // Debug statement

            return () => {
                console.log("Clearing interval and disconnecting socket..."); // Debug statement
                clearInterval(intervalId);
                newSocket.disconnect();
            };
        }
    }, [recordingStatus]);

    useEffect(() => {
        const uploadAndHandleResponse = async () => {
            if (mediaBlobUrl) {
                console.log("Media blob URL is available, uploading video..."); // Debug statement
                await uploadVideo(mediaBlobUrl);
            }
        };

        uploadAndHandleResponse();
    }, [mediaBlobUrl]);

    const uploadVideo = async (url) => {
        if (url) {
            console.log("Uploading video with URL:", url); // Debug statement
            const videoBlob = await fetch(url).then((res) => res.blob());
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `shruti-${timestamp}.mp4`;
            const formData = new FormData();
            formData.append("video", videoBlob, fileName);
            formData.append("question", question);
            const urlVideo = `${API_BASE_URL}${VIDEO_PATH}`
            try {
                console.log("Sending video to backend..."); // Debug statement
                const response = await fetch(
                    urlVideo,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (response.ok) {
                    const responseData = await response.json();
                    setRecordingStatus("Upload successful!");
                    console.log("Upload successful:", responseData); // Debug statement
                    props.func(responseData);

                    return responseData;
                } else {
                    const errorMessage = await response.text();
                    setRecordingStatus("Upload failed. Please try again.");
                    console.log("Upload failed:", errorMessage); // Debug statement
                    return null;
                }
            } catch (error) {
                setRecordingStatus(
                    "Upload failed. Please check your connection."
                );
                console.log("Error during upload:", error); // Debug statement
                return null;
            }
        } else {
            setRecordingStatus("No video recorded.");
            console.log("No video recorded."); // Debug statement
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center mb-4">
                <h1 className="text-1xl font-semibold leading-relaxed text-gray-900 dark:text-slate-900">
                    {recordingStatus}
                </h1>
                {backendMessage == "Multiple faces detected" && (
                    <div>
                        <div
                            class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                            role="alert"
                        >
                            <svg
                                class="flex-shrink-0 inline w-4 h-4 me-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                            </svg>
                            <span class="sr-only">Info</span>
                            <div className="mt-2 text-center text-red-500">
                                <span className="font-medium">
                                    Alert! {backendMessage}
                                </span>{" "}
                                Only one face should be visible at a time.
                                Please adjust your position.
                            </div>
                        </div>
                    </div>
                )}
                {backendMessage == "Face not detected" && (
                    <div
                        class="flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
                        role="alert"
                    >
                        <svg
                            class="flex-shrink-0 inline w-4 h-4 me-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span class="sr-only">Info</span>
                        <div>
                            <span className="font-medium">
                                Alert! {backendMessage}
                            </span>{" "}
                            Please stay under the video frame.
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center">
                {/* <div className="w-1100 mb-5 h-1100 bg-black relative rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-1100 h-1100 object-cover"
                    />
                </div> */}
                <div className="w-fit h-full mb-5 bg-black relative rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>

                {(backendMessage == "Looking right" ||
                    backendMessage == "Looking left") && (
                    <div>
                        <div>
                            <span className="font-medium">
                                Alert! {backendMessage}
                            </span>{" "}
                            Please ensure you're looking at the camera.
                        </div>
                    </div>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            </div>
        </div>
    );
});

export default VideoRecorder;
