

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const InterviewResult = () => {
    const location = useLocation();
    const [res, setRes] = useState(location.state?.finalResult || []);

    useEffect(() => {
        setRes(location.state?.finalResult || []);
        console.log(location.state?.finalResult);
    }, [location.state]);

    const emotionEmojis = {
        Neutral: "😐",
        Sad: "😢",
        Angry: "😠",
        Happy: "😊",
        Surprise: "😮",
        Fear: "😨",
        Disgust: "🤢",
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-cyan-800">
                Interview Result
            </h1>
            {res && res.length > 0 ? (
                res.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-lg"
                    >
                        <h1 className="text-4xl font-bold mb-6 text-cyan-800">
                            Question {index + 1} : { item.Original_Ques }
                        </h1>
                        <h3 className="font-semibold mt-2 text-xl text-gray-800">
                            Top Three Emotions:
                        </h3>
                        <div className="flex space-x-4 mt-4">
                            {item.video["Top Three Emotions"] &&
                                Object.entries(item.video["Top Three Emotions"]).map(
                                    ([emotion, score]) => (
                                        <div
                                            key={emotion}
                                            className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out w-1/3"
                                        >
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">
                                                    {emotionEmojis[emotion] || ""}
                                                </div>
                                                <p className="text-lg font-semibold text-gray-700">
                                                    {emotion}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Your Response:</h2>
                        <p className="text-gray-700 mb-4">{item.audio}</p>
                        <h2 className="text-xl font-semibold mb-2">
                            Video Analysis:
                        </h2>
                        <ul className="list-disc pl-5">
                            <h3 className="font-semibold text-2xl text-gray-800 mt-6">
                                Average Emotion Scores:
                            </h3>
                            <ul className="space-y-4 mt-4">
                                {item.video["Average Emotion Scores"] &&
                                    Object.entries(item.video["Average Emotion Scores"]).map(
                                        ([emotion, score]) => (
                                            <li
                                                key={emotion}
                                                className={`flex items-center p-4 rounded-lg shadow-lg ${
                                                    score >= 0.5
                                                        ? "bg-green-100 border-green-500 text-green-800"
                                                        : score >= 0.2
                                                        ? "bg-yellow-100 border-yellow-500 text-yellow-800"
                                                        : "bg-red-100 border-red-500 text-red-800"
                                                } border-2 transition-all duration-300 ease-in-out transform hover:scale-105`}
                                            >
                                                <span className="mr-3 text-2xl">
                                                    {emotionEmojis[emotion] || ""}
                                                </span>
                                                <span className="font-semibold text-lg">
                                                    {emotion}
                                                </span>
                                                <span className="ml-2 text-xl font-bold">
                                                    {score.toFixed(2)}
                                                </span>
                                            </li>
                                        )
                                    )}
                            </ul>

                            <h3 className="font-semibold mt-6 text-xl text-gray-800">
                                Mean Stress Level:
                            </h3>
                            <div className="flex items-center space-x-4 mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className={`h-4 rounded-full transition-all duration-500 ease-in-out ${
                                            item.video["Mean Stress Level"] <= 30
                                                ? "bg-green-400"
                                                : item.video["Mean Stress Level"] <= 60
                                                ? "bg-yellow-400"
                                                : "bg-red-500"
                                        }`}
                                        style={{
                                            width: `${item.video["Mean Stress Level"]}%`,
                                        }}
                                    ></div>
                                </div>
                                <p
                                    className={`text-sm font-semibold ${
                                        item.video["Mean Stress Level"] <= 30
                                            ? "text-green-600"
                                            : item.video["Mean Stress Level"] <= 60
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {item.video["Mean Stress Level"].toFixed(2)}%
                                </p>
                            </div>
                        </ul>

                        <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                            Evaluation Result:
                        </h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
                            <p className="text-gray-800 text-lg font-medium leading-relaxed">
                                {item.evaluation_result}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <h2 className="text-xl text-gray-700">No results available</h2>
            )}
        </div>
    );
};

export default InterviewResult;
