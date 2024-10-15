import React, { useState, useEffect } from "react";

const TextToSpeech = (props) => {
    useEffect(() => {
        const synth = window.speechSynthesis;
        const u = new SpeechSynthesisUtterance(props.text);


        const speakTimeout = setTimeout(() => {
            synth.speak(u);
        }, 100); 

        console.log("Text for speech is ", props.text)
        console.log("u for speech is ", u)


        synth.speak(u);

        return () => {
            synth.cancel();
            clearTimeout(speakTimeout);
        };
    }, [props.text]);

    return (
        <div>
            {/* <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button> */}
        </div>
    );
};

export default TextToSpeech;
