import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Input, Button } from "../../ImportStatements";
import { loginReducer } from "../../ReduxToolkit/AuthSlice";

function RequestApi() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    function CallApi() {
        axios
            .post("http://127.0.0.1:8000/login/", { email, password })
            .then((res) => {
                if (res.data.data && res.data.data.access) {
                    const accessToken = res.data.data.access;
                  
                    dispatch(loginReducer({ token: accessToken  }));
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
        <div>
            <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                type="text"
                className="text-1xl text-gray-100"
            />
            <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                className="text-1xl text-gray-100"
            />
            <Button onClick={CallApi} label="Login" />
            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
}

export default RequestApi;
