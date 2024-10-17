import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const InterviewResult = () => {
    const location = useLocation();  
    const [res, setRes] = useState(location.state?.finalResult || []);  

    useEffect(() => {
        setRes(location.state?.finalResult || []);
        console.log(location.state?.finalResult);
    }, [location.state]);

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-cyan-800">Interview Result</h1>
            {res && res.length > 0 ? (
                res.map((item, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg">
                        <h1 className="text-4xl font-bold mb-6 text-cyan-800">Question {index + 1}</h1>
                        <h2 className="text-xl font-semibold mb-2">Audio:</h2>
                        <p className="text-gray-700 mb-4">{item.audio}</p>
                        <h2 className="text-xl font-semibold mb-2">Video Analysis:</h2>
                        <ul className="list-disc pl-5">
                            <h3 className="font-semibold">Average Emotion Scores:</h3>
                            {item.video["Average Emotion Scores"] &&
                                Object.entries(item.video["Average Emotion Scores"]).map(([emotion, score]) => (
                                    <li key={emotion} className="text-gray-600">{emotion}: {score}</li>
                                ))}

                            <h3 className="font-semibold mt-2">Mean Stress Level:</h3>
                            <li className="text-gray-600">{item.video["Mean Stress Level"]}</li>

                            <h3 className="font-semibold mt-2">Top Three Emotions:</h3>
                            {item.video["Top Three Emotions"] &&
                                Object.entries(item.video["Top Three Emotions"]).map(([emotion, score]) => (
                                    <li key={emotion} className="text-gray-600">{emotion}: {score}</li>
                                ))}
                        </ul>
                    </div>
                ))
            ) : (
                <h2 className="text-xl text-gray-700">No results available</h2>  
            )}
        </div>
    );
};

export default InterviewResult;
