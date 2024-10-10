import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Input, Button } from "../../ImportStatements";
import { loginReducer  } from "../../ReduxToolkit/AuthSlice";
import { StoreProfileData } from "../../ReduxToolkit/ProfileSlice"


function ToogleForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    const dispatch = useDispatch();


    function CallProfileAPI(token){
        if(token)
        {
            axios.get("http://127.0.0.1:8000/profile/",
                {
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            .then((res) => {
                if(res.data)
                {
                    dispatch(StoreProfileData({data: res.data}))
                }
            })
            .catch((err) => {
                console.error("Error during Profile API call:", err);
                setError("Failed to fetch Profile Data.");
            });
        }
       
    }

    function CallApi(e) {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:8000/login/", { email, password })
            .then((res) => {
                if (res.data.data && res.data.data.access) {
                    const accessToken = res.data.data.access;


                    dispatch(loginReducer({ token: accessToken }));
                    CallProfileAPI(accessToken)
                    setError("");
                } else {
                    setError("Login successful, but tokens are missing.");
                }
            })
            .catch((err) => {
                console.error("Error during API call:", err);
                setError("Failed to login. Please check your credentials.");
            });
    }

    

    return (
        <div >  
            <div className="p-4 ">
               
                <div className=" flex items-center flex-col justify-center ">
                    
                        <form className="absolute z-50 mt-2 p-2 border rounded-lg shadow-md  w-full sm:p-4 sm:w-[50%] ">
                            <div className="mb-4">
                                <Input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    label="Email"
                                    className="mt-1 block w-full   bg-blue-300 px-3 py-2 border border-gray-300 rounded-md"
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
                                    className="mt-1 block w-full bg-blue-300 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <Button
                                onClick={CallApi}
                                ButtonName="Login"
                              
                                className="bg-purple-600 text-white px-4 py-2 rounded-md"
                            />
                           
                            {error && (
                                <div className="text-red-500">{error}</div>
                            )}
                        </form>
                    
                </div>
            </div>
        </div>
    );
}

export default ToogleForm;
