

// import React, { useEffect, useState, useRef } from "react";
// import VideoRecorder from "./VideoRecorder";

// const Channels = () => {
//     const [questions, setQuestions] = useState("");
    
//     const [clientMess, setClientMess] = useState("Python");
//     const ws = useRef(null);
//     const videoRecorderRef = useRef(null);

//     useEffect(() => {
//         ws.current = new WebSocket("ws://127.0.0.1:8000/ws/sc/");

//         ws.current.onopen = async () => {
//             console.log("WebSocket connection established.");
//             ws.current.send(JSON.stringify({ client_mess: clientMess }));
//         };

//         ws.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data && data.question) {
//                 setQuestions(data.question);
//                 console.log("New question is   ---",data.question)
//                 handleStartRecording(); // Start recording when a new question is received
//             } else if (data.error) {
//                 console.error("Error from server:", data.error);
//             }
//         };

//         ws.current.onclose = () => {
//             console.log("WebSocket connection closed.");
//         };

//         return () => {
//             if (ws.current) {
//                 ws.current.close();
//             }
//         };
//     }, []);

//     // Start recording when a new question is received
//     const handleStartRecording = () => {
//         if (videoRecorderRef.current) {
//             videoRecorderRef.current.startRecording(); // Start recording
//         }
//     };

//     // Handle clicking "Next Question"
//     const handleNextQuestion = async () => {
//         if (videoRecorderRef.current) {
//             // Stop the current recording and upload it
//              videoRecorderRef.current.stopAndUpload();
//         }

//         // // Send new message for the next question
//         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify({ client_mess: clientMess }));
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-center mb-4">
//                 Interview Questions
//             </h1>
//             <button
//                 onClick={handleNextQuestion}
//                 className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
//             >
//                 Next Question
//             </button>
//             <ul className="mt-4 space-y-2">{questions}</ul>
//             <div className="mt-6">
//                 <VideoRecorder ref={videoRecorderRef} />
//             </div>
//         </div>
//     );
// };

// export default Channels;
import React, { useEffect, useState, useRef } from "react";
import VideoRecorder from "./VideoRecorder";

const Channels = () => {
    const [questions, setQuestions] = useState("");
    const [clientMess, setClientMess] = useState("Python");
    const ws = useRef(null);
    const videoRecorderRef = useRef(null);

    useEffect(() => {
        ws.current = new WebSocket("ws://127.0.0.1:8000/ws/sc/");

        ws.current.onopen = async () => {
            console.log("WebSocket connection established.");
            ws.current.send(JSON.stringify({ client_mess: clientMess }));
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data && data.question) {
                setQuestions(data.question);
                console.log("New question is ---", data.question);
                handleStartRecording(); // Start recording when a new question is received
            } else if (data.error) {
                console.error("Error from server:", data.error);
            }
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    // Start recording when a new question is received
    const handleStartRecording = () => {
        if (videoRecorderRef.current) {
            videoRecorderRef.current.startRecording(); // Start recording
        }
    };

    // Handle clicking "Next Question"
    const handleNextQuestion = async () => {
        if (videoRecorderRef.current) {
            // Stop the current recording and upload it
            videoRecorderRef.current.stopAndUpload();
        }

        // Send new message for the next question
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ client_mess: clientMess }));
        }
    };

    return (
        <div className="max-w-7xl mx-auto  rounded-lg shadow-xl">
            <h1 className="text-4xl mx-3 px-5 font-extrabold text-center text-white mb-1">
                Interview Questions
            </h1>
            {questions && (
                <div className="mt-1 p-6 pb-12 mb-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Current Question
                    </h2>
                    <p className="text-gray-700 text-lg ">{questions}</p>
                </div>
            )}

            <button
                onClick={handleNextQuestion}
                className="max-w-full mx-4 py-3 px-9  bg-yellow-400 text-zinc-950 hover:text-zinc-200 font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-cyan-800"
            >
                Next Question
            </button>

            
            <div className="mt-2 bg-white rounded-lg shadow-md ">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Video Recorder
                </h2>
                <VideoRecorder ref={videoRecorderRef} />
            </div>
        </div>
    );
};

export default Channels;
