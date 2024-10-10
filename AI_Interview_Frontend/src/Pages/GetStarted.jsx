import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);

    const navigate = useNavigate();

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    const handleProceed = () => {
        if (isChecked) {
            setTimerActive(true);
        }
    };

    useEffect(() => {
        let timer;

        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((tl) => tl - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            navigate("/s");
        }

        return () => clearInterval(timer);
    }, [timerActive, timeLeft, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-xl w-full">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
                    Mock Interview Instructions
                </h2>
                <ul className="list-disc text-gray-700 mb-6 ml-4">
                    <li className="mb-2">
                        Ensure you are in a quiet place with no distractions.
                    </li>
                    <li className="mb-2">
                        Have a stable internet connection for a smooth
                        experience.
                    </li>
                    <li className="mb-2">
                        Prepare your resume and any other relevant documents.
                    </li>
                    <li className="mb-2">
                        You will be asked a series of questions to simulate a
                        real interview.
                    </li>
                    <li className="mb-2">
                        Take your time to answer each question carefully.
                    </li>
                    <li className="mb-2">
                        Once the interview starts, you cannot pause it.
                    </li>
                    <li>
                        Your performance will be reviewed at the end of the mock
                        interview.
                    </li>
                </ul>

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
                        I have read and understood the instructions
                    </label>
                </div>

                <button
                    onClick={handleProceed}
                    disabled={!isChecked}
                    className={`w-full py-3 text-white rounded-lg font-semibold ${
                        isChecked
                            ? "bg-yellow-500 hover:bg-cyan-800"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Proceed to Mock Interview
                </button>
            </div>

            {timerActive && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center z-70">
                    <div className="text-5xl font-semibold text-stone-100 mb-4">
                        Redirecting in
                    </div>
                    <div className="rounded-full inline-flex items-center justify-center bg-yellow-500 w-40 h-40 text-gray-800 text-6xl font-bold">
                        {timeLeft}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetStarted;
