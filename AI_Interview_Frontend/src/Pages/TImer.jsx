import React, { useEffect, useState } from 'react';

const TImer = (props) => {
    const [timeLeft, setTimeLeft] = useState(1); // Set your desired countdown time here
    const [timerActive, setTimerActive] = useState(true);

    useEffect(() => {
        let timer;

        if (timerActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimerActive(false);
            clearInterval(timer);
            console.log("Timer ended yeah..");
            props.onTimerEnd(); // Call the onTimerEnd callback when the timer ends
        }

        return () => clearInterval(timer);
    }, [timeLeft, timerActive]);

    return (
        <div>
            {timerActive && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center z-70">
                    <div className="text-5xl font-semibold text-stone-100 mb-4">
                        Video Recording will start in
                    </div>
                    <div className="rounded-full inline-flex items-center justify-center bg-yellow-500 w-40 h-40 text-gray-800 text-6xl font-bold">
                        {timeLeft}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TImer;
