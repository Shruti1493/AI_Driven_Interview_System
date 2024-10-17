import { useEffect, useState, useRef } from "react";
import { Button } from "@material-tailwind/react";
import TImer from "./TImer";
import VideoRecorder from "./VideoRecorder";
import { useNavigate } from "react-router-dom";

const StartInterview = () => {
    const ws = useRef(null);
    const [question, setQuestion] = useState(null);
    const [startTimer, setStartTimer] = useState(false);
    const [startVideo, setStartVideo] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [showScreen, setShowScreen] = useState(false);
    const [spokenWords, setSpokenWords] = useState("");
    const [apiresult, setApiResult] = useState(null);
    const [finalResult, setFinalResult] = useState(null);
    const videoRecorderRef = useRef(null);
    const navigate = useNavigate();


    const WebSocketUrl = "ws://127.0.0.1:8000/ws/sc/";

    useEffect(() => {
        console.log("Connecting to WebSocket...");
        ws.current = new WebSocket(WebSocketUrl);

        ws.current.onopen = () => {
            console.log("Connection established");
            ws.current.send(
                JSON.stringify({ client_mess: "Connection accepted by client" })
            );
        };

        ws.current.onmessage = (e) => {
            const jsObjQuestion = JSON.parse(e.data);
            if (jsObjQuestion["question"]) {
                setQuestion(jsObjQuestion["question"]);
                setStartTimer(false);
                setQuestionIndex((prev) => prev + 1);
            }
            if (jsObjQuestion['FinalResult']) {
                setFinalResult(jsObjQuestion['FinalResult']);
                console.log("Start Intervurw ",jsObjQuestion['FinalResult']);
                navigate("/result", { state: { finalResult: jsObjQuestion['FinalResult'] } }); // Pass result in navigate
                ws.current.close();
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
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(
                JSON.stringify({ client_mess: "Send Next Question pls" })
            );
        }
        if (videoRecorderRef.current) {
            // Stop the current recording and upload it
            videoRecorderRef.current.stopAndUpload();

            setStartVideo(false);
        }
    };

    const handleStartRecording = () => {
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
        if (data) {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({ result: data }));
            }
        }
    };
    useEffect(() => {
        if (apiresult) {
            UploadResult(apiresult);
        }
    }, [apiresult]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-cyan-800 mb-8">
                Interview Session
            </h1>
            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-6xl">
                {question ? (
                    <>
                        {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Question:</h2> */}
                        {spokenWords && (
                            <h1 className="max-w-6xl text-3xl font-semibold leading-relaxed text-gray-900 dark:text-slate-900">
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
                    </>
                ) : (
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Waiting for questions...
                    </h2>
                )}
            </div>

            {!startTimer && question && (
                <Button
                    className=" text-white bg-yellow-500 hover:bg-cyan-800 transition duration-200 mb-4"
                    onClick={handleNextButton}
                    variant="filled"
                >
                    Next Question
                </Button>
            )}

            {!startTimer && (
                <div className="mt-2 bg-white rounded-lg shadow-md p-4 w-full max-w-xl">
                    <VideoRecorder ref={videoRecorderRef} func={SendResult} />
                </div>
            )}
        </div>
    );
};

export default StartInterview;
