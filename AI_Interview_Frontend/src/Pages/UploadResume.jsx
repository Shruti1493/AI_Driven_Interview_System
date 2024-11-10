import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

import { useNavigate } from "react-router-dom";

function UploadResume() {
    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Validate file type
        if (
            file &&
            (file.type === "application/pdf" ||
                file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        ) {
            setResume(file);
            setError(""); // Clear any previous error
        } else {
            setError("Please upload a valid PDF or DOCX file.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!resume) {
            setError("Please select a file to upload.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/resume/parse/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setResumeData(response.data);
            alert("Resume uploaded successfully!");
        } catch (err) {
            console.error("Error uploading resume:", err);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleNextButton = () => {
        console.log("Button file path ", resumeData['file_path']);
        
        navigate("/start", { state: { file_path: resumeData['file_path'] } });
        //   navigate("/start", { state: { file_path: "C:\\Users\\91937\\Desktop\\Major_Project_MONGODB\\AI_Interview_System\\Uploaded_resumes\\Shruti Kedari SDE_wUm2xkm.pdf" } });
    }
    return (
        <section className="bg-gradient-to-r to-cyan-500 min-h-screen flex items-center justify-center py-16">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
                <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">
                    Upload Your Resume
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-lg font-medium mb-2"
                            htmlFor="resume"
                        >
                            Resume
                        </label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            onChange={handleFileChange}
                            className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-md focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
                        />
                    </div>
                    {error && (
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                    )}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform ${
                                loading
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:scale-105"
                            }`}
                        >
                            {loading ? "Uploading..." : "Upload Resume"}
                        </button>
                    </div>
                </form>
                {/* Displaying resume data */}
                {resumeData && (
                    <div className="mt-8 p-6 bg-gray-50 border border-gray-300 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">
                            Resume Details:
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Personal Information
                                </h3>
                                <p>
                                    <strong>Name:</strong> {resumeData.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {resumeData.email}
                                </p>
                                <p>
                                    <strong>Mobile Number:</strong>{" "}
                                    {resumeData.mobile_number}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Skills
                                </h3>
                                <ul className="list-disc ml-6">
                                    {resumeData.skills.map((skill, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-700"
                                        >
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Education
                                </h3>
                                {resumeData.degree &&
                                resumeData.degree.length > 0 ? (
                                    <ul className="list-disc ml-6">
                                        {resumeData.degree.map(
                                            (degree, index) => (
                                                <li
                                                    key={index}
                                                    className="text-gray-700"
                                                >
                                                    {degree}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700">
                                        No education details provided.
                                    </p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Experience
                                </h3>
                                <ul className="list-disc ml-6">
                                    {resumeData.experience.map((exp, index) => (
                                        <li
                                            key={index}
                                            className="text-gray-700"
                                        >
                                            {exp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Company Names
                                </h3>
                                <ul className="list-disc ml-6">
                                    {resumeData.company_names.map(
                                        (company, index) => (
                                            <li
                                                key={index}
                                                className="text-gray-700"
                                            >
                                                {company}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Other Details
                                </h3>
                                <p>
                                    <strong>Number of Pages:</strong>{" "}
                                    {resumeData.no_of_pages}
                                </p>
                                <p>
                                    <strong>Total Experience:</strong>{" "}
                                    {resumeData.total_experience} years
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    className=" text-white bg-yellow-500 hover:bg-cyan-800 transition duration-200 mb-4"
                    onClick={handleNextButton}
                    variant="filled"
                >
                    Next Question
                </Button>
            </div>
        </section>
    );
}

export default UploadResume;
