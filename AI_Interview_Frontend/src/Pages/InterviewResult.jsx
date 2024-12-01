
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";

// const InterviewResult = () => {
//     const location = useLocation();
//     const [res, setRes] = useState(location.state?.finalResult || []);
//     const [selectedQuestion, setSelectedQuestion] = useState(0);

//     useEffect(() => {
//         setRes(location.state?.finalResult || []);
//         console.log(location.state?.finalResult);
//     }, [location.state]);

//     const emotionEmojis = {
//         Neutral: "😐",
//         Sad: "😢",
//         Angry: "😠",
//         Happy: "😊",
//         Surprise: "😮",
//         Fear: "😨",
//         Disgust: "🤢",
//     };

//     // Function to get top 2 emotions
//     const getTopTwoEmotions = () => {
//         const emotions = res[selectedQuestion].video["Top Three Emotions"];
//         if (!emotions) return [];

//         // Sort emotions by score in descending order and get the top 2
//         return Object.entries(emotions)
//             .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
//             .slice(0, 3);
//     };

//     return (
//         <div className="flex min-h-screen bg-gray-100">
//             {/* Sidebar */}
//             <div className="w-1/4 bg-gray-200 text-black p-4 overflow-y-auto">
//                 <h2 className="text-2xl font-bold mb-4">Questions</h2>
//                 <ul className="space-y-2">
//                     {res.map((_, index) => (
//                         <li
//                             key={index}
//                             onClick={() => setSelectedQuestion(index)}
//                             className={`p-3 rounded-md cursor-pointer text-center ${
//                                 selectedQuestion === index
//                                     ? "bg-yellow-500"
//                                     : "bg-cyan-800 hover:bg-yellow-500"
//                             }`}
//                         >
//                             Question {index + 1}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Content */}
//             <div className="flex-1 p-6">
//                 <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-violet-600 drop-shadow-lg uppercase tracking-wider">
//                     Interview Result
//                 </h1>

//                 {res && res[selectedQuestion] ? (
//                     <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-FULL mx-auto">
//                         <h1 className="text-2xl font-bold mb-6 text-cyan-800">
//                             Question {selectedQuestion + 1}: {res[selectedQuestion].Original_Ques}
//                         </h1>
//                         <h3 className="font-semibold mt-7 text-xl text-gray-800">
//                             Top Three Emotions:
//                         </h3>
//                         <div className="flex space-x-4 mt-4">
//                             {getTopTwoEmotions().map(([emotion, score]) => (
//                                 <div
//                                     key={emotion}
//                                     className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out w-1/3"
//                                 >
//                                     <div className="text-center">
//                                         <div className="text-4xl mb-2">
//                                             {emotionEmojis[emotion] || ""}
//                                         </div>
//                                         <p className="text-lg font-semibold text-gray-700">
//                                             {emotion} 
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* Additional content */}
//                         <h2 className="text-xl mt-7 font-semibold mb-2">Your Response:</h2>
//                         <p className="text-gray-700 mb-4">
//                             {res[selectedQuestion].audio}
//                         </p>
                    
//                         {/* Average Emotion Scores */}
//                         <h3 className="font-semibold text-2xl text-gray-800 mt-6">
//                             Average Emotion Scores:
//                         </h3>
//                         <ul className="space-y-4 mt-4">
//                             {res[selectedQuestion].video["Average Emotion Scores"] &&
//                                 Object.entries(res[selectedQuestion].video["Average Emotion Scores"]).map(
//                                     ([emotion, score]) => (
//                                         <li
//                                             key={emotion}
//                                             className={`flex items-center p-4 rounded-lg shadow-lg ${
//                                                 score >= 0.5
//                                                     ? "bg-green-100 border-green-500 text-green-800"
//                                                     : score >= 0.2
//                                                     ? "bg-yellow-100 border-yellow-500 text-yellow-800"
//                                                     : "bg-red-100 border-red-500 text-red-800"
//                                             } border-2 transition-all duration-300 ease-in-out transform hover:scale-105`}
//                                         >
//                                             <span className="mr-3 text-2xl">
//                                                 {emotionEmojis[emotion] || ""}
//                                             </span>
//                                             <span className="font-semibold text-lg">
//                                                 {emotion}
//                                             </span>
//                                             <span className="ml-2 text-xl font-bold">
//                                                 {score.toFixed(2)}
//                                             </span>
//                                         </li>
//                                     )
//                                 )}
//                         </ul>

//                         <h3 className="font-semibold mt-6 text-xl text-gray-800">
//                             Mean Stress Level:
//                         </h3>
//                         <div className="flex items-center space-x-4 mt-4">
//                             <div className="w-full bg-gray-200 rounded-full h-4">
//                                 <div
//                                     className={`h-4 rounded-full transition-all duration-500 ease-in-out ${
//                                         res[selectedQuestion].video["Mean Stress Level"] <= 30
//                                             ? "bg-green-400"
//                                             : res[selectedQuestion].video["Mean Stress Level"] <= 60
//                                             ? "bg-yellow-400"
//                                             : "bg-red-500"
//                                     }`}
//                                     style={{
//                                         width: `${res[selectedQuestion].video["Mean Stress Level"]}%`,
//                                     }}
//                                 ></div>
//                             </div>
//                             <p
//                                 className={`text-sm font-semibold ${
//                                     res[selectedQuestion].video["Mean Stress Level"] <= 30
//                                         ? "text-green-600"
//                                         : res[selectedQuestion].video["Mean Stress Level"] <= 60
//                                         ? "text-yellow-600"
//                                         : "text-red-600"
//                                 }`}
//                             >
//                                 {res[selectedQuestion].video["Mean Stress Level"].toFixed(2)}%
//                             </p>
//                         </div>

//                         <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
//                             Evaluation Result
//                         </h2>
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
//                             <p className="text-gray-800 text-lg font-medium leading-relaxed">
//                                 {res[selectedQuestion].evaluation_result}
//                             </p>
//                         </div>
//                         <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
//                             Relevancy Score 
//                         </h2>
//                         <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
//                             <p className="text-gray-800 text-lg font-medium leading-relaxed">
//                                 {res[selectedQuestion].Relevancy_Score}
//                             </p>
//                         </div>
//                     </div>
//                 ) : (
//                     <h2 className="text-xl text-gray-700">No results available</h2>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InterviewResult;


import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LinearScale,
    CategoryScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend
);

const InterviewResult = () => {
    const location = useLocation();
    const [res, setRes] = useState(location.state?.finalResult || []);
    const [selectedQuestion, setSelectedQuestion] = useState(0);

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

    // Function to get top 3 emotions
    const getTopThreeEmotions = () => {
        const emotions = res[selectedQuestion]?.video["Top Three Emotions"];
        if (!emotions) return [];

        return Object.entries(emotions)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
            .slice(0, 3);
    };

    const relevancyScores = res.map((item, index) => ({
        label: `Question ${index + 1}`,
        score: parseFloat(item.Relevancy_Score) || 0,
    }));

    const chartData = {
        labels: relevancyScores.map((item) => item.label),
        datasets: [
            {
                label: "Relevancy Score",
                data: relevancyScores.map((item) => item.score),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 5,
            },
        },
    };


    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-200 text-black p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Questions</h2>
                <ul className="space-y-2">
                    {res.map((_, index) => (
                        <li
                            key={index}
                            onClick={() => setSelectedQuestion(index)}
                            className={`p-3 rounded-md cursor-pointer text-center ${
                                selectedQuestion === index
                                    ? "bg-yellow-500"
                                    : "bg-cyan-800 hover:bg-yellow-500"
                            }`}
                        >
                            Question {index + 1}
                        </li>
                    ))}
                    <li
                        onClick={() => setSelectedQuestion(res.length)}
                        className={`p-3 rounded-md cursor-pointer text-center ${
                            selectedQuestion === res.length
                                ? "bg-yellow-500"
                                : "bg-cyan-800 hover:bg-yellow-500"
                        }`}
                    >
                        Summary
                    </li>
                </ul>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-violet-600 drop-shadow-lg uppercase tracking-wider">
                    Interview Result
                </h1>

                {selectedQuestion < res.length ? (
                    res[selectedQuestion] ? (
                        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
                            <h1 className="text-2xl font-bold mb-6 text-cyan-800">
                                Question {selectedQuestion + 1}: {res[selectedQuestion].Original_Ques}
                            </h1>

                            <h3 className="font-semibold mt-7 text-xl text-gray-800">
                                Top Three Emotions:
                            </h3>
                            <div className="flex space-x-4 mt-4">
                                {getTopThreeEmotions().map(([emotion, score]) => (
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
                                ))}
                            </div>

                            <h2 className="text-xl mt-7 font-semibold mb-2">Your Response:</h2>
                            <p className="text-gray-700 mb-4">
                                {res[selectedQuestion].audio}
                            </p>

                            <h3 className="font-semibold text-2xl text-gray-800 mt-6">
                                Average Emotion Scores:
                            </h3>
                            <ul className="space-y-4 mt-4">
                                {res[selectedQuestion].video["Average Emotion Scores"] &&
                                    Object.entries(res[selectedQuestion].video["Average Emotion Scores"]).map(
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
                                            res[selectedQuestion].video["Mean Stress Level"] <= 30
                                                ? "bg-green-400"
                                                : res[selectedQuestion].video["Mean Stress Level"] <= 60
                                                ? "bg-yellow-400"
                                                : "bg-red-500"
                                        }`}
                                        style={{
                                            width: `${res[selectedQuestion].video["Mean Stress Level"]}%`,
                                        }}
                                    ></div>
                                </div>
                                <p
                                    className={`text-sm font-semibold ${
                                        res[selectedQuestion].video["Mean Stress Level"] <= 30
                                            ? "text-green-600"
                                            : res[selectedQuestion].video["Mean Stress Level"] <= 60
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {res[selectedQuestion].video["Mean Stress Level"].toFixed(2)}%
                                </p>
                            </div>

                            <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                                Evaluation Result
                            </h2>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
                                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                                    {res[selectedQuestion].evaluation_result}
                                </p>
                            </div>

                            <h2 className="text-2xl font-semibold text-cyan-800 mb-6">
                                Relevancy Score
                            </h2>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
                                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                                    {res[selectedQuestion].Relevancy_Score}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <h2 className="text-xl text-gray-700">No results available</h2>
                    )
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-full mx-auto">
                        <h2 className="text-2xl font-bold text-cyan-800">Summary</h2>
                        <div className="bg-white p-4 rounded-md shadow-lg">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewResult;
