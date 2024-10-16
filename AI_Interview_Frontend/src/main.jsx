import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./ReduxToolkit/Store.js";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
   
    Login,
    UploadResume,
    GetStarted,
} from "./ImportStatements.js";
import ToogleForm from "./Components/FormComponents/ToggleForm.jsx";
import StartInterview from "./Pages/StartInterview.jsx";
import InterviewResult from "./Pages/InterviewResult.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            {" "}
            {/* Wrap the whole app with Provider */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<ToogleForm />} />
                    <Route path="/upload-resume" element={<UploadResume />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    
                    <Route path="/start" element={<StartInterview />} />
                    <Route path="/result" element={<InterviewResult />} />

                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
