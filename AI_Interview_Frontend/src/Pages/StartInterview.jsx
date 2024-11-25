import { useEffect, useState, useRef } from "react";
import { Button } from "@material-tailwind/react";
import TImer from "../Components/InterviewComponents/TImer";
import VideoRecorder from "../Components/InterviewComponents/VideoRecorder";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const StartInterview = () => {
    const ws = useRef(null);
    const [question, setQuestion] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [startTimer, setStartTimer] = useState(false);
    const [startVideo, setStartVideo] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [proceedButton, setProceedButton] = useState(false);
    const [showScreen, setShowScreen] = useState(false);
    const [spokenWords, setSpokenWords] = useState("");
    const [userans, setuserans] = useState("");
    const [apiresult, setApiResult] = useState(null);
    const [finalResult, setFinalResult] = useState(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);
    const [endLoader, setEndLoader] = useState(false);
    const recognitionRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const videoRecorderRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    // const [file_p, setfile_p] = useState(location.state?.file_path || []);

    const WebSocketUrl = "ws://127.0.0.1:8000/ws/sc/";
    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    useEffect(() => {
        console.log("Connecting to WebSocket...");

        ws.current = new WebSocket(WebSocketUrl);

        ws.current.onopen = () => {
            console.log("Connection established");
        };

        ws.current.onmessage = (e) => {
            const jsObjQuestion = JSON.parse(e.data);
            if (jsObjQuestion["question"]) {
                setQuestion(jsObjQuestion["question"]);
                setStartTimer(false);
                setQuestionIndex((prev) => prev + 1);
            }
            if (jsObjQuestion["FinalResult"]) {
                setFinalResult(jsObjQuestion["FinalResult"]);
                console.log(
                    "Received FinalResult",
                    jsObjQuestion["FinalResult"]
                );
                // Wait a bit before navigating away, allowing time for all data
                setTimeout(() => {
                    navigate("/result", {
                        state: { finalResult: jsObjQuestion["FinalResult"] },
                    });
                    ws.current.close();
                }, 2000);
            }
        };

        ws.current.onclose = () => {
            console.log("Connection closed");
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);
    const initializeSpeechRecognition = () => {
        if (!("webkitSpeechRecognition" in window)) {
            console.error("Speech Recognition not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join("");
            setuserans(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current = recognition;
    };

    const startSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            console.log("Speech recognition started");
        }
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            console.log("Speech recognition stopped");
        }
    };

    useEffect(() => {
        initializeSpeechRecognition();

        return () => {
            stopSpeechRecognition();
        };
    }, []);

    useEffect(() => {
        // Function to check if audio and video are enabled
        const checkMediaDevices = async () => {
            try {
                // Request permission for audio and video devices
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                });

                // Get audio and video tracks
                const audioTrack = stream.getAudioTracks()[0];
                const videoTrack = stream.getVideoTracks()[0];

                // Check if audio and video tracks are enabled
                setAudioEnabled(audioTrack.enabled);
                setVideoEnabled(videoTrack.enabled);

                // Stop the stream to release the media devices
                stream.getTracks().forEach((track) => track.stop());
            } catch (err) {
                console.error("Error accessing media devices: ", err);
            }
        };

        checkMediaDevices();
    }, []);

    const SendResumepath = () => {
        if (location.state) {
            console.log(location.state?.file_path);
            ws.current.send(
                JSON.stringify({
                    resume: location.state?.file_path,
                    Skills: location.state?.Skills,
                })
            );
        }
    };

    const handleStartButton = () => {
        if (isChecked && videoEnabled && audioEnabled) {
            SendResumepath();
            setProceedButton(true);
        }
    };
    useEffect(() => {
        if (question) {
            const words = question.split(" ");
            const synth = window.speechSynthesis;
            const u = new SpeechSynthesisUtterance(question);

            // Function to update the spoken words
            u.onboundary = (event) => {
                if (event.charIndex) {
                    const currentIndex = words.findIndex((_, index) => {
                        const charCount =
                            words.slice(0, index).join(" ").length + index; // + index to account for spaces
                        return (
                            charCount <= event.charIndex &&
                            charCount + words[index].length > event.charIndex
                        );
                    });
                    if (currentIndex !== -1) {
                        // Update the spoken words by appending the current word
                        setSpokenWords(
                            words.slice(0, currentIndex + 1).join(" ")
                        );
                    }
                }
            };

            // Function to display the entire question after speech ends
            u.onend = async () => {
                console.log("Speech end");
                setSpokenWords(question);
                setShowScreen(true);
                setStartTimer(true); // Start the timer after speech ends
                console.log("Timer started yeah..");
            };

            // Start speaking the question
            synth.speak(u);

            return () => {
                synth.cancel();
            };
        }
    }, [question]);

    const handleNextButton = () => {
        setIsRecording(false);
        stopSpeechRecognition();
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({
                    client_mess: "Send Next Question pls",
                    client_ques: question,
                    client_ans: userans,
                })
            );
        }
        if (videoRecorderRef.current) {
            // Stop the current recording and upload it
            videoRecorderRef.current.stopAndUpload(question);

            setStartVideo(false);
        }
    };

    const handleFinishButton = () => {
        // handleNextButton();
        setIsRecording(false);

        setEndLoader(true);
        stopSpeechRecognition();
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({
                    client_mess: "Send Next Question pls",
                    client_ques: question,
                    client_ans: userans,
                })
            );
        }
        if (videoRecorderRef.current) {
            // Stop the current recording and upload it
            videoRecorderRef.current.stopAndUpload(question);

            setStartVideo(false);
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        startSpeechRecognition();
        if (videoRecorderRef.current) {
            videoRecorderRef.current.startRecording();
        }
    };

    useEffect(() => {
        if (startVideo) {
            setStartVideo(true);
            handleStartRecording();
        }
    }, [startVideo]);

    const SendResult = (data) => {
        if (data) {
            setApiResult(data);
        }
    };

    const UploadResult = async (data) => {
        console.log("Upload Resylt   ", data);
        if (data) {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ result: data }));
            }
        }
    };
    useEffect(() => {
        console.log("Api response use effect ");
        if (apiresult) {
            UploadResult(apiresult);
        }
    }, [apiresult]);

    return (
        <>
            <div className="flex flex-col mt-6 items-center justify-center ">
                {/* <div>
                    <h1 className="  mt-3 text-3xl font-bold leading-relaxed text-cyan-800 mb-8">
                        Interview Session
                    </h1>
                </div> */}
                <div className="flex flex-col items-center justify-self-auto   bg-gray-100 p-4 gap-4">
                    {!question && (
                        <div>
                            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl w-full">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                                    Mock Interview Instructions
                                </h2>
                                <ul className="list-disc text-gray-700 mb-6 ml-4">
                                    <li className="mb-2">
                                        Ensure you are in a quiet place with no
                                        distractions.
                                    </li>
                                    <li className="mb-2">
                                        Have a stable internet connection for a
                                        smooth experience.
                                    </li>
                                    <li className="mb-2">
                                        Prepare your resume and any other
                                        relevant documents.
                                    </li>
                                    <li className="mb-2">
                                        You will be asked a series of questions
                                        to simulate a real interview.
                                    </li>
                                    <li className="mb-2">
                                        Take your time to answer each question
                                        carefully.
                                    </li>
                                    <li className="mb-2">
                                        Once the interview starts, you cannot
                                        pause it.
                                    </li>
                                    <li>
                                        Your performance will be reviewed at the
                                        end of the mock interview.
                                    </li>
                                </ul>

                                <div className="flex items-center mb-6">
                                    <input
                                        type="checkbox"
                                        id="instructionCheckbox"
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                        checked={audioEnabled} // This checks the box when audio is enabled
                                        readOnly // Prevents user from manually checking or unchecking the box
                                    />
                                    <label
                                        htmlFor="instructionCheckbox"
                                        className="ml-3 text-gray-700"
                                    >
                                        Audio Check
                                    </label>
                                </div>
                                <div className="flex items-center mb-6">
                                    <input
                                        type="checkbox"
                                        id="instructionCheckbox"
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                        checked={videoEnabled} // This checks the box when audio is enabled
                                        readOnly // Prevents user from manually checking or unchecking the box
                                    />
                                    <label
                                        htmlFor="instructionCheckbox"
                                        className="ml-3 text-gray-700"
                                    >
                                        Video Check
                                    </label>
                                </div>

                                <div className="flex items-center mb-6">
                                    <input
                                        type="checkbox"
                                        id="instructionCheckbox"
                                        className="form-checkbox h-5 w-5 text-indigo-600"
                                        onChange={handleCheckboxChange}
                                    />
                                    <label
                                        htmlFor="instructionCheckbox"
                                        className="ml-3 text-gray-700"
                                    >
                                        I have read and understood the
                                        instructions
                                    </label>
                                </div>
                            </div>

                            <div className="mt-6">
                                {!audioEnabled && (
                                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                                        Turn on Audio and Video
                                    </h2>
                                )}
                            </div>

                            <button
                                onClick={handleStartButton}
                                disabled={
                                    !isChecked && videoEnabled && audioEnabled
                                }
                                className={`w-full py-3 text-white rounded-lg font-semibold ${
                                    isChecked && videoEnabled && audioEnabled
                                        ? "bg-yellow-500 hover:bg-cyan-800"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Proceed to Mock Interview
                            </button>
                        </div>
                    )}
                    {endLoader && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-gray-900 bg-opacity-50">
                            <div className="flex flex-col items-center">
                                <div
                                    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                                <p className="text-gray-900 mt-4 text-3xl font-bold leading-relaxed">
                                    🤖 Generating result of the Interview... 🕒
                                </p>
                            </div>
                        </div>
                    )}

                    {proceedButton && !question && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-gray-900 bg-opacity-50">
                            <div
                                className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status"
                            >
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                    Loading...
                                </span>
                            </div>
                            <div
                                className="inline-block h-12 w-12 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
                                role="status"
                            >
                                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    )}

                    {question ? (
                        <>
                            <div className="bg-white shadow-lg rounded-lg p-4 mb-2  w-full max-w-6xl">
                                {spokenWords && (
                                    <h1 className="max-w-6xl text-2xl font-semibold leading-relaxed text-gray-900 dark:text-slate-900">
                                        {spokenWords}
                                    </h1>
                                )}
                                {startTimer && (
                                    <TImer
                                        key={questionIndex}
                                        onTimerEnd={() => {
                                            setStartVideo(true);
                                            setStartTimer(false);
                                            setShowScreen(true);
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <h2>{/* Waiting for questions... */}</h2>
                    )}
                </div>
                {!startTimer && question && (
                    <div>
                        <button
                            onClick={handleNextButton}
                            class="relative inline-flex items-center justify-center p-0.5 mb-2 mt-6 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                        >
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Next Question
                            </span>
                        </button>

                        <button
                            onClick={handleFinishButton}
                            class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                        >
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Finish Interview
                            </span>
                        </button>
                    </div>
                )}

                    <div >
                        
                        {!startTimer && question && !endLoader && (
                            <div className="mt-2 bg-white rounded-lg shadow-md p-2 w-full max-w-xl">
                                <VideoRecorder
                                    ref={videoRecorderRef}
                                    func={SendResult}
                                />
                            </div>
                        )}
                    </div>
              
            </div>
        </>
    );
};

export default StartInterview;
