import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./ReduxToolkit/Store.js";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Channels, Login, UploadResume, GetStarted } from "./ImportStatements.js";
import ToogleForm from "./Components/FormComponents/ToggleForm.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            {" "}
            {/* Wrap the whole app with Provider */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<ToogleForm />} />
                    <Route path="/upload-resume" element={<UploadResume />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/s" element={<Channels />} />
                    
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);


// import React, { useEffect, useState, useRef } from "react";
// import VideoRecorder from "./VideoRecorder";
// const Channels = () => {
//     const [questions, setQuestions] = useState("");
//     const [clientMess, setClientMess] = useState("Advance Python"); // Initial message
//     const ws = useRef(null) // Store the websocker connectoon in useRef

//     useEffect(() => {
//         const ws = new WebSocket("ws://127.0.0.1:8000/ws/sc/");

//         ws.onopen = async () => {
//             console.log("WebSocket connection established.");

//             ws.send(JSON.stringify({ client_mess: clientMess })); // Send initial message
//         };

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             console.log("jsjsj");
//             console.log(data.question);
//             if (data && data.question) {
//                 setQuestions(data.question);
//                 console.log("sjsj");
//                 console.log(questions);
//             } else if (data.error) {
//                 console.error("Error from server:", data.error);
//             }
//         };

//         ws.onclose = () => {
//             console.log("WebSocket connection closed.");
//         };

//         return () => {
//             ws.close();
//         };
//     }, [clientMess]);

//     const handleSendMessage = () => {
//         const ws = new WebSocket("ws://127.0.0.1:8000/ws/sc/"); // Re-establish connection
//         ws.onopen = () => {
//             ws.send(JSON.stringify({ client_mess: clientMess }));
//         };
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-center mb-4">
//                 Interview Questions
//             </h1>
//             <button
//                 onClick={handleSendMessage}
//                 className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
//             >
//                 Send Message
//             </button>
//             <ul className="mt-4 space-y-2">{questions}</ul>
//             <div className="mt-6">
//                 <VideoRecorder />
//             </div>
//         </div>
//     );
// };

// export default Channels;






// import React, { useEffect, useState, useRef } from 'react';
// import VideoRecorder from './VideoRecorder'; // Assuming you have a VideoRecorder component

// const Channels = () => {
//     const [questions, setQuestions] = useState("");
//     const [result1, setResult] = useState([]);
//     const [clientMess, setClientMess] = useState("java");
//     const ws = useRef(null);
//     const videoRecorderRef = useRef(null);

//     useEffect(() => {
//         console.log("Updated8888888888 results:");
//         console.log(result1);
//         console.log("Number of entries:", result1.length);
//     }, [result1]);
    

//     useEffect(() => {
//         ws.current = new WebSocket("ws://127.0.0.1:8000/ws/sc/");

//         ws.current.onopen = () => {
//             console.log("WebSocket connection established.");
//             ws.current.send(JSON.stringify({ client_mess: clientMess }));
//         };

//         ws.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             if (data && data.question) {
//                 setQuestions(data.question);
//                 handleStartRecording(); // Start recording when a new question is received
//             }
//             if (data && data.result) {
//                 setResult((prevResult) => [...prevResult, data.result]);
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

//     const handleStartRecording = () => {
//         if (videoRecorderRef.current) {
//             videoRecorderRef.current.startRecording(); // Start recording
//         }
//     };

//     const handleUploadResponse = (responseData) => {
//         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify({ uploadResponse: responseData }));
//         }
//     };
  
//     const handleNextQuestion = async  () => {
//         if (videoRecorderRef.current) {
//             await videoRecorderRef.current.stopAndUpload();
//         }

//         if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//             ws.current.send(JSON.stringify({ client_mess: clientMess }));
//         }
//     };

//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h1 className="text-2xl font-bold text-center mb-4">Interview Questions</h1>

//             <ul>
//                 {result1 && result1.map((entry, index) => (
//                     <div key={index} style={{ marginBottom: '20px' }}>
//                         <h3>Entry {index + 1}</h3>
//                         <h4>Average Emotion Scores:</h4>
//                         <ul>
//                             {entry['Average Emotion Scores'] && Object.entries(entry['Average Emotion Scores']).map(([emotion, score], idx) => (
//                                 <li key={idx}>
//                                     {emotion}: {score.toFixed(4)}
//                                 </li>
//                             ))}
//                         </ul>
//                         <h4>Top Three Emotions:</h4>
//                         <ul>
//                             {entry['Top Three Emotions'] && Object.entries(entry['Top Three Emotions']).map(([emotion, score], idx) => (
//                                 <li key={idx}>
//                                     {emotion}: {score.toFixed(4)}
//                                 </li>
//                             ))}
//                         </ul>
//                         <h4>Mean Stress Level: {entry['Mean Stress Level'] || 'N/A'}</h4>
//                     </div>
//                 ))}
//             </ul>

//             <button
//                 onClick={handleNextQuestion}
//                 className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
//             >
//                 Next Question
//             </button>
//             <ul className="mt-4 space-y-2">{questions}</ul>

//             <div className="mt-6">
//                 <VideoRecorder
//                     ref={videoRecorderRef}
//                     onUploadResponse={handleUploadResponse}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Channels;
