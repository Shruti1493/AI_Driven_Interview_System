
// import React, {
//     useState,
//     useEffect,
//     useRef,
//     forwardRef,
//     useImperativeHandle,
// } from "react";
// import { useReactMediaRecorder } from "react-media-recorder";

// const VideoRecorder = forwardRef((props, ref) => {
//     const { onUploadResponse } = props; // Accept the callback prop
//     const [recordingStatus, setRecordingStatus] = useState(null);
//     const [mediaBlobUrl, setMediaBlobUrl] = useState("");
//     const videoRef = useRef(null);

//     const {
//         startRecording,
//         stopRecording,
//     } = useReactMediaRecorder({
//         video: true,
//         onStop: (blobUrl) => {
//             setMediaBlobUrl(blobUrl); // Set the URL when stopped
//         },
//         mediaRecorderOptions: {
//             mimeType: "video/webm; codecs=vp8",
//         },
//     });

//     // Expose startRecording and stopAndUpload function to the parent component using ref
//     useImperativeHandle(ref, () => ({
//         startRecording: () => {
//             startRecording(); // Start recording
//             setRecordingStatus("Recording...");
//         },
//         stopAndUpload: async () => {
//             stopRecording(); // Stop the recording
//             setRecordingStatus("Uploading video...");
//             const responseData = await uploadVideo(); // Upload the video after stopping the recording
//             if (responseData) {
//                 onUploadResponse(responseData); // Call the callback with the response data
//             }
//         },
//     }));

//     // Get user media for live video feed
//     useEffect(() => {
//         const getUserMedia = async () => {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                 });
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             } catch (err) {
//                 console.error("Error accessing user media:", err);
//                 setRecordingStatus("Failed to access camera.");
//             }
//         };

//         getUserMedia();
//     }, []);

//     // Upload recorded video to backend
//     const uploadVideo = async () => {
//         if (mediaBlobUrl) {
//             const videoBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
//             const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//             const fileName = `recording-${timestamp}.mp4`;
//             const formData = new FormData();
//             formData.append("video", videoBlob, fileName);

//             try {
//                 const response = await fetch("http://localhost:8000/interview/upload_video/", {
//                     method: "POST",
//                     body: formData,
//                 });

//                 console.log("Upload Response:", response);

//                 if (response.ok) {
//                     const responseData = await response.json(); // Parse the JSON response
//                     console.log("Response Data:", responseData);
//                     alert("Video uploaded successfully!");
//                     setRecordingStatus("Upload successful!");
//                     return responseData; // Return the response data
//                 } else {
//                     const errorMessage = await response.text();
//                     console.error("Error uploading video:", errorMessage);
//                     setRecordingStatus("Upload failed. Please try again.");
//                     return null; // Return null on failure
//                 }
//             } catch (error) {
//                 console.error("Upload failed:", error);
//                 setRecordingStatus("Upload failed. Please check your connection.");
//                 return null; // Return null on error
//             }
//         } else {
//             alert("No video to upload!");
//             setRecordingStatus("No video recorded.");
//             return null; // Return null if no video was recorded
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//             <div className="text-center mb-4">
//                 <h1>Record Interview</h1>
//                 <p>{recordingStatus}</p>
//             </div>
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     marginTop: "20px",
//                 }}
//             >
//                 <video
//                     ref={videoRef}
//                     autoPlay
//                     muted
//                     style={{
//                         width: "700px",
//                         height: "300px",
//                         border: "1px solid black",
//                     }}
//                 />
//                 {/* {mediaBlobUrl && (
//                     <video
//                         src={mediaBlobUrl}
//                         controls
//                         style={{
//                             width: "700px",
//                             height: "300px",
//                             border: "1px solid black",
//                         }}
//                     />
//                 )} */}
//             </div>
//         </div>
//     );
// });

// export default VideoRecorder;
import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";

const VideoRecorder = forwardRef((props, ref) => {
    const { onUploadResponse } = props;
    
    const [recordingStatus, setRecordingStatus] = useState(null);
    const [mediaBlobUrl, setMediaBlobUrl] = useState("");
    const videoRef = useRef(null);

    const {
        startRecording,
        stopRecording,
    } = useReactMediaRecorder({
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
            setRecordingStatus("Recording...");
        },
        stopAndUpload: async () => {
            stopRecording();
            setRecordingStatus("Uploading video...");
            const responseData = await uploadVideo();
            if (responseData) {
                onUploadResponse(responseData);
            }
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
                console.error("Error accessing user media:", err);
                setRecordingStatus("Failed to access camera.");
            }
        };

        getUserMedia();
    }, []);

    const uploadVideo = async () => {
        if (mediaBlobUrl) {
            const videoBlob = await fetch(mediaBlobUrl).then((res) => res.blob());
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const fileName = `shruti-${timestamp}.mp4`;
            const formData = new FormData();
            formData.append("video", videoBlob, fileName);

            try {
                const response = await fetch("http://localhost:8000/interview/upload_video/", {
                    method: "POST",
                    body: formData,
                });

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
                setRecordingStatus("Upload failed. Please check your connection.");
                return null;
            }
        } else {
            setRecordingStatus("No video recorded.");
            return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100  ">
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800">Record Interview</h1>
                <p className="text-gray-600">{recordingStatus}</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-full max-w-lg h-64 bg-black relative mb-4 rounded-lg overflow-hidden">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* {mediaBlobUrl && (
                    <div className="w-full max-w-lg h-64 bg-black relative rounded-lg overflow-hidden">
                        <video
                            src={mediaBlobUrl}
                            controls
                            className="w-full h-full object-cover"
                        />
                    </div>
                )} */}
            </div>
        </div>
    );
});

export default VideoRecorder;
