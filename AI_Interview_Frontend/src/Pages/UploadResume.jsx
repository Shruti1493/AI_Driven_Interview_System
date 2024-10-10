// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function UploadResume() {
//     const [resume, setResume] = useState(null);
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [resumeData, setResumeData] = useState(null); // State for storing resume data

//     useEffect(() => {
//         // Function to fetch resume data (replace with the actual endpoint)
//         const fetchResumeData = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/resume/data/'); // Adjust the endpoint as needed
//                 setResumeData(response.data); // Set the resume data from the response
//             } catch (err) {
//                 console.error('Error fetching resume data:', err);
//                 setError('Failed to fetch resume data. Please try again later.');
//             }
//         };

//         fetchResumeData();
//     }, []);

//     const handleFileChange = (e) => {
//         setResume(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         if (!resume) {
//             setError('Please select a file to upload.');
//             setLoading(false);
//             return;
//         }

//         const formData = new FormData();
//         formData.append('resume', resume);

//         try {
//             const response = await axios.post('http://127.0.0.1:8000/resume/parse/', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });
//             setResumeData(response.data); // Set the resume data from the response
//             alert('Resume uploaded successfully!');
//         } catch (err) {
//             console.error('Error uploading resume:', err);
//             setError('Failed to upload resume. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <section className="bg-gradient-to-r to-cyan-500 min-h-screen flex items-center justify-center py-16">
//             <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
//                 <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Upload Your Resume</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="resume">
//                             Resume
//                         </label>
//                         <input
//                             type="file"
//                             id="resume"
//                             name="resume"
//                             onChange={handleFileChange}
//                             className="block w-full text-gray-700 border border-gray-300 rounded-md shadow-md focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105"
//                         />
//                     </div>
//                     {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
//                     <div className="flex items-center justify-center">
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className={`bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
//                         >
//                             {loading ? 'Uploading...' : 'Upload Resume'}
//                         </button>
//                     </div>
//                 </form>
//                 {/* Displaying resume data */}
//                 {resumeData && (
//                     <div className="mt-8 p-6 bg-gray-50 border border-gray-300 rounded-lg">
//                         <h2 className="text-2xl font-bold mb-4 text-gray-700">Resume Details:</h2>
//                         <div className="space-y-6">
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
//                                 <p><strong>Name:</strong> {resumeData.name}</p>
//                                 <p><strong>Email:</strong> {resumeData.email}</p>
//                                 <p><strong>Mobile Number:</strong> {resumeData.mobile_number}</p>
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
//                                 <div className="flex flex-wrap gap-4">
//                                     {resumeData.skills.map(skill => (
//                                         <button
//                                             key={skill}
//                                             className="bg-teal-200 text-teal-800 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-teal-300 transition duration-300 transform hover:scale-105"
//                                         >
//                                             {skill}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Education</h3>
//                                 <ul className="list-disc ml-6">
//                                     {resumeData.degree.map((degree, index) => (
//                                         <li key={index} className="text-gray-700">{degree}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
//                                 <div className="space-y-4">
//                                     {resumeData.experience.map((exp, index) => (
//                                         <div key={index} className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
//                                             <p className="text-gray-700">{exp}</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Company Names</h3>
//                                 <ul className="list-disc ml-6">
//                                     {resumeData.company_names.map((company, index) => (
//                                         <li key={index} className="text-gray-700">{company}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-semibold text-gray-800">Other Details</h3>
//                                 <p><strong>Number of Pages:</strong> {resumeData.no_of_pages}</p>
//                                 <p><strong>Total Experience:</strong> {resumeData.total_experience} years</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// }

// export default UploadResume;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UploadResume() {
    const [resume, setResume] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resumeData, setResumeData] = useState(null); // State for storing resume data
    const [newSkill, setNewSkill] = useState('');
    const [newDegree, setNewDegree] = useState('');
    const [newExperience, setNewExperience] = useState('');

    useEffect(() => {
        // Function to fetch resume data (replace with the actual endpoint)
        const fetchResumeData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/resume/data/'); // Adjust the endpoint as needed
                setResumeData(response.data); // Set the resume data from the response
            } catch (err) {
                console.error('Error fetching resume data:', err);
                setError('Failed to fetch resume data. Please try again later.');
            }
        };

        fetchResumeData();
    }, []);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!resume) {
            setError('Please select a file to upload.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('resume', resume);

        try {
            const response = await axios.post('http://127.0.0.1:8000/resume/parse/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResumeData(response.data); // Set the resume data from the response
            alert('Resume uploaded successfully!');
        } catch (err) {
            console.error('Error uploading resume:', err);
            setError('Failed to upload resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = async () => {
        if (newSkill && !resumeData.skills.includes(newSkill)) {
            try {
                const updatedData = { ...resumeData, skills: [...resumeData.skills, newSkill] };
                await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
                setResumeData(updatedData);
                setNewSkill('');
            } catch (err) {
                console.error('Error updating skills:', err);
                setError('Failed to update skills. Please try again.');
            }
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        try {
            const updatedData = { ...resumeData, skills: resumeData.skills.filter(skill => skill !== skillToRemove) };
            await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
            setResumeData(updatedData);
        } catch (err) {
            console.error('Error removing skill:', err);
            setError('Failed to remove skill. Please try again.');
        }
    };

    const handleAddDegree = async () => {
        if (newDegree && !resumeData.degree.includes(newDegree)) {
            try {
                const updatedData = { ...resumeData, degree: [...resumeData.degree, newDegree] };
                await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
                setResumeData(updatedData);
                setNewDegree('');
            } catch (err) {
                console.error('Error updating degree:', err);
                setError('Failed to update degree. Please try again.');
            }
        }
    };

    const handleRemoveDegree = async (degreeToRemove) => {
        try {
            const updatedData = { ...resumeData, degree: resumeData.degree.filter(degree => degree !== degreeToRemove) };
            await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
            setResumeData(updatedData);
        } catch (err) {
            console.error('Error removing degree:', err);
            setError('Failed to remove degree. Please try again.');
        }
    };

    const handleAddExperience = async () => {
        if (newExperience) {
            try {
                const updatedData = { ...resumeData, experience: [...resumeData.experience, newExperience] };
                await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
                setResumeData(updatedData);
                setNewExperience('');
            } catch (err) {
                console.error('Error updating experience:', err);
                setError('Failed to update experience. Please try again.');
            }
        }
    };

    const handleRemoveExperience = async (experienceToRemove) => {
        try {
            const updatedData = { ...resumeData, experience: resumeData.experience.filter(exp => exp !== experienceToRemove) };
            await axios.put('http://127.0.0.1:8000/resume/update/', updatedData); // Adjust the endpoint as needed
            setResumeData(updatedData);
        } catch (err) {
            console.error('Error removing experience:', err);
            setError('Failed to remove experience. Please try again.');
        }
    };

    return (
        <section className="bg-gradient-to-r to-cyan-500 min-h-screen flex items-center justify-center py-16">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
                <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">Upload Your Resume</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-lg font-medium mb-2" htmlFor="resume">
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
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-teal-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                        >
                            {loading ? 'Uploading...' : 'Upload Resume'}
                        </button>
                    </div>
                </form>
                {/* Displaying resume data */}
                {resumeData && (
                    <div className="mt-8 p-6 bg-gray-50 border border-gray-300 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-700">Resume Details:</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
                                <p><strong>Name:</strong> {resumeData.name}</p>
                                <p><strong>Email:</strong> {resumeData.email}</p>
                                <p><strong>Mobile Number:</strong> {resumeData.mobile_number}</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {resumeData.skills.map(skill => (
                                        <button
                                            key={skill}
                                            className="bg-teal-200 text-teal-800 px-4 py-2 rounded-lg font-medium shadow-md hover:bg-teal-300 transition duration-300 transform hover:scale-105"
                                        >
                                            {skill}
                                            <span
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="ml-2 text-red-600 cursor-pointer"
                                            >
                                                ❌
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center mb-4">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add new skill"
                                        className="border border-gray-300 rounded-md px-3 py-2 mr-2"
                                    />
                                    <button
                                        onClick={handleAddSkill}
                                        className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform"
                                    >
                                        Add Skill
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Education</h3>
                                <ul className="list-disc ml-6">
                                    {resumeData.degree.map((degree, index) => (
                                        <li key={index} className="text-gray-700">
                                            {degree}
                                            <span
                                                onClick={() => handleRemoveDegree(degree)}
                                                className="ml-2 text-red-600 cursor-pointer"
                                            >
                                                ❌
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center mt-4">
                                    <input
                                        type="text"
                                        value={newDegree}
                                        onChange={(e) => setNewDegree(e.target.value)}
                                        placeholder="Add new degree"
                                        className="border border-gray-300 rounded-md px-3 py-2 mr-2"
                                    />
                                    <button
                                        onClick={handleAddDegree}
                                        className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform"
                                    >
                                        Add Degree
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
                                <div className="space-y-4">
                                    {resumeData.experience.map((exp, index) => (
                                        <div key={index} className="p-4 bg-white shadow-sm rounded-md border border-gray-200">
                                            <p className="text-gray-700">
                                                {exp}
                                                <span
                                                    onClick={() => handleRemoveExperience(exp)}
                                                    className="ml-2 text-red-600 cursor-pointer"
                                                >
                                                    ❌
                                                </span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center mt-4">
                                    <input
                                        type="text"
                                        value={newExperience}
                                        onChange={(e) => setNewExperience(e.target.value)}
                                        placeholder="Add new experience"
                                        className="border border-gray-300 rounded-md px-3 py-2 mr-2"
                                    />
                                    <button
                                        onClick={handleAddExperience}
                                        className="bg-teal-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 transform"
                                    >
                                        Add Experience
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Company Names</h3>
                                <ul className="list-disc ml-6">
                                    {resumeData.company_names.map((company, index) => (
                                        <li key={index} className="text-gray-700">{company}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Other Details</h3>
                                <p><strong>Number of Pages:</strong> {resumeData.no_of_pages}</p>
                                <p><strong>Total Experience:</strong> {resumeData.total_experience} years</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default UploadResume;

