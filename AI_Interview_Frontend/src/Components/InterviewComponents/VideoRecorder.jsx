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
    const [question, setQuestion] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
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
        stopAndUpload: async (ques) => {
            stopRecording();
            console.log("from stop ans uploaf", ques);
            setQuestion(ques);

            setRecordingStatus("");
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
            console.log("Ques from prop ", question);
            formData.append("question", question);
            try {
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
                    console.log("ANsert result received ", responseData);
                    props.func(responseData);

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
                <h1 className="text-1xl font-semibold leading-relaxed text-gray-900 dark:text-slate-900">
                    {recordingStatus}
                </h1>
            </div>
            {/* <div className="flex justify-center space-x-4 mb-4">
                <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Hide Camera
                    </span>
                </button>
                <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Cyan to blue
                    </span>
                </button>
            </div> */}
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
