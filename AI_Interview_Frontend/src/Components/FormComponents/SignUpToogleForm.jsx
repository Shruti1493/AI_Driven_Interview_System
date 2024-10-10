import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Input, Button } from "../../ImportStatements";
import { loginReducer } from "../../ReduxToolkit/AuthSlice";
import { StoreProfileData } from "../../ReduxToolkit/ProfileSlice";

function SignUpToogleForm() {
    const [email, setEmail] = useState("");
    const [FirstName, setFirstName] = useState("");
    const [LastName, setLastName] = useState("");
    const [College, setCollege] = useState("");
    const [Branch, setBranch] = useState("");
    const [phone_number, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [profile_photo, setProfilePhoto] = useState(null);  // Changed to null to handle file object
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    async function callProfileAPI(token) {
        try {
            const response = await axios.get("http://127.0.0.1:8000/profile/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch(StoreProfileData({ data: response.data }));
        } catch (err) {
            console.error("Error during Profile API call:", err);
            setError("Failed to fetch Profile Data.");
        }
    }

    async function callApi(e) {
        e.preventDefault();
        setLoading(true);
        setError(""); // Reset error before new request

        // Create FormData object for file upload
        const formData = new FormData();
        formData.append("email", email);
        formData.append("FirstName", FirstName);
        formData.append("LastName", LastName);
        formData.append("College", College);
        formData.append("Branch", Branch);
        formData.append("phone_number", phone_number);
        formData.append("password", password);
        formData.append("password2", password2);
        if (profile_photo) {
            formData.append("profile_photo", profile_photo);
        }

        try {
            const res = await axios.post("http://127.0.0.1:8000/reg/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Ensure multipart/form-data
                },
            });

            if (res.data.data && res.data.data.access) {
                const accessToken = res.data.data.access;
                dispatch(loginReducer({ token: accessToken }));
                await callProfileAPI(accessToken);
            } else {
                setError("Signup successful, but tokens are missing.");
            }
        } catch (err) {
            console.error("Error during API call:", err);
            if (err.response && err.response.data && err.response.data.errors) {
                setError(err.response.data.errors.profile_photo[0]);
            } else {
                setError("Failed to sign up. Please check your inputs.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="p-4">
                <div className="flex items-center flex-col justify-center">
                    <form
                        className="absolute z-50 mt-2 p-2 border rounded-lg shadow-md w-full sm:p-4 sm:w-[50%]"
                        onSubmit={callApi}
                        encType="multipart/form-data"  // Important for file upload
                    >
                        <div className="flex flex-row justify-around">
                            <div>
                                <div className="mb-4">
                                    <Input
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        type="email"
                                        label="Email"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 text-blue-200 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={FirstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        type="text"
                                        label="First Name"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={LastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        type="text"
                                        label="Last Name"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={College}
                                        onChange={(e) =>
                                            setCollege(e.target.value)
                                        }
                                        type="text"
                                        label="College"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="mb-4">
                                    <Input
                                        value={Branch}
                                        onChange={(e) =>
                                            setBranch(e.target.value)
                                        }
                                        type="text"
                                        label="Branch"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={phone_number}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        type="tel"
                                        label="Phone Number"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        type="password"
                                        label="Password"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <Input
                                        value={password2}
                                        onChange={(e) =>
                                            setPassword2(e.target.value)
                                        }
                                        type="password"
                                        label="Confirm Password"
                                        className="mt-1 block w-full bg-blue-300 px-3 py-2 border text-blue-200 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mb-4">
                            <Input
                                onChange={(e) => setProfilePhoto(e.target.files[0])}  // Correctly handle file input
                                type="file"
                                label="Profile Photo"
                                className="mt-1 block w-full bg-blue-300 px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex justify-center mb-4">
                            <Button
                                type="submit"
                                ButtonName={loading ? "Loading..." : "Sign Up"}
                                disabled={loading}
                                onClick={callApi}
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                            />
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpToogleForm;
