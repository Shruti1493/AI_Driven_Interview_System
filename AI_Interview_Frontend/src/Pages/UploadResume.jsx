import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@material-tailwind/react";

import { useNavigate } from "react-router-dom";

function UploadResume() {
    const [resume, setResume] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [uploadPressed, setUploadPressed] = useState(false);
    const [uploadFile, setUploadFile] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setUploadFile(true);
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
        setUploadPressed(true);

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
        } catch (err) {
            console.error("Error uploading resume:", err);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleNextButton = () => {
        console.log("Button file path ", resumeData["file_path"]);

        navigate("/start", { state: { file_path: resumeData["file_path"] } });
        //   navigate("/start", { state: { file_path: "C:\\Users\\91937\\Desktop\\Major_Project_MONGODB\\AI_Interview_System\\Uploaded_resumes\\Shruti Kedari SDE_wUm2xkm.pdf" } });
    };
    return (
        <div>
            <div className="max-w-lg mx-auto">
                {!resumeData && (
                    <div>
                        <h1 className="text-2xl font-bold mb-6 mt-5 text-center text-gray-800">
                            Upload Your Resume
                        </h1>

                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center w-full">
                                <label
                                    for="dropzone-file"
                                    class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 "
                                >
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span class="font-semibold">
                                                Click to upload
                                            </span>{" "}
                                            or drag and drop
                                        </p>
                                        <p class="text-xs text-gray-500 dark:text-gray-400">
                                            SVG, PNG, JPG or GIF (MAX.
                                            800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        class="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {error && (
                                        <p className="text-red-600 text-sm mb-4">
                                            {error}
                                        </p>
                                    )}

                                    {uploadFile && (
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
                                                {loading
                                                    ? "Uploading..."
                                                    : "Upload Resume"}
                                            </button>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <div className="bg-gray-200 min-h-screen">
                {/* -------------------------------------------------------------- */}
                {resumeData && (
                    <div className="max-w-7xl mx-auto mt-8">
                        {/* Grid */}
                        <div className="flex flex-wrap">
                            {/* Left Column */}
                            <div className="w-full md:w-1/3 p-4">
                                <div className="bg-white text-gray-800 shadow-lg rounded-lg">
                                    <div className="relative  mt-9">
                                        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 p-4 text-white">
                                            <h2 className="text-2xl">
                                                {resumeData.name}
                                            </h2>
                                        </div>
                                    </div>
                                    {resumeData && (
                                        <Button
                                            className=" text-white text-sm bg-cyan-800  mt-6 ml-8 hover:bg-yellow-500 transition duration-200 mb-4"
                                            onClick={handleNextButton}
                                            variant="filled"
                                        >
                                            Proceed for the interview
                                        </Button>
                                    )}
                                    <div className="p-4">
                                        <p className="flex items-center mb-2">
                                            <i className="fa fa-briefcase mr-2 text-teal-500"></i>
                                            {resumeData.email}
                                        </p>
                                        <p className="flex items-center mb-2">
                                            <i className="fa fa-home mr-2 text-teal-500"></i>
                                            {resumeData.mobile_number}
                                        </p>

                                        {resumeData.degree &&
                                        resumeData.degree.length > 0 ? (
                                            <ul className="list-disc ml-6">
                                                {resumeData.degree.map(
                                                    (degree, index) => (
                                                        <p className="flex items-center mb-2">
                                                            <li
                                                                key={index}
                                                                className="fa fa-home mr-2 text-teal-500"
                                                            ></li>
                                                            {degree}
                                                        </p>
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-700">
                                                No education details provided.
                                            </p>
                                        )}
                                        <hr className="my-4" />

                                        {/* Skills */}
                                        <p className="text-lg font-semibold flex items-center mb-2">
                                            <i className="fa fa-asterisk mr-2 text-teal-500"></i>{" "}
                                            Skills
                                        </p>
                                      
                                        {resumeData &&
                                        resumeData.skills &&
                                        resumeData.skills.length > 0 ? (
                                            resumeData.skills.map(
                                                (skill, index) => (
                                                    <div key={index}>
                                                        {" "}
                                                        {/* Use skill.id if available */}
                                                        <p>{skill}</p>
                                                        <div className="bg-gray-200 rounded-full h-4 mb-2">
                                                            <div
                                                                className="bg-teal-500 h-4 rounded-full text-center text-white text-sm"
                                                                style={{
                                                                    width: "90%",
                                                                }}
                                                            >
                                                                90%
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="text-gray-700">
                                                No skills details provided.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="w-full md:w-2/3 p-4">
                                {/* Work Experience */}
                                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                        <i className="fa fa-suitcase text-teal-500 mr-2"></i>{" "}
                                        Work Experience
                                    </h2>
                                    <ul className="list-disc ml-6">
                                        {resumeData &&
                                        resumeData.experience &&
                                        resumeData.experience.length > 0 ? (
                                            resumeData.experience.map(
                                                (exp, index) => (
                                                    <li
                                                        key={index}
                                                        className="text-gray-700"
                                                    >
                                                        <div className="mb-4">
                                                            <h5 className="font-semibold text-gray-600">
                                                                {exp}
                                                            </h5>
                                                        </div>
                                                    </li>
                                                )
                                            )
                                        ) : (
                                            <p className="text-gray-700">
                                                No Work Experience details
                                                provided.
                                            </p>
                                        )}
                                    </ul>
                                </div>

                                {/* Education */}
                                <div className="bg-white shadow-lg rounded-lg p-6">
                                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                        <i className="fa fa-certificate text-teal-500 mr-2"></i>{" "}
                                        Other Details
                                    </h2>
                                    <h6 className="text-teal-500">
                                        <i className="fa fa-calendar mr-2"></i>
                                        <strong className="text-slate-950">
                                            Number of Pages:
                                        </strong>{" "}
                                        {resumeData.no_of_pages}
                                    </h6>
                                    <h6 className="text-teal-500">
                                        <i className="fa fa-calendar mr-2"></i>
                                        <strong className="text-slate-950">
                                            Total Experience:
                                        </strong>{" "}
                                        {resumeData.total_experience} years
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                {resumeData && (
                    <footer className="bg-teal-500 text-center p-6 mt-8 text-white">
                        <p>Data Extracted from Resume</p>
                        <div className="flex justify-center space-x-4">
                            <i className="fa fa-facebook-official hover:opacity-75"></i>
                            <i className="fa fa-instagram hover:opacity-75"></i>
                            <i className="fa fa-snapchat hover:opacity-75"></i>
                            <i className="fa fa-pinterest-p hover:opacity-75"></i>
                            <i className="fa fa-twitter hover:opacity-75"></i>
                            <i className="fa fa-linkedin hover:opacity-75"></i>
                        </div>
                        <p className="mt-4">
                            {" "}
                            <a
                                href="http://127.0.0.1:5173/"
                                className="underline text-2xl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ace Interview
                            </a>
                        </p>
                    </footer>
                )}
            </div>
        </div>
    );
}

export default UploadResume;
