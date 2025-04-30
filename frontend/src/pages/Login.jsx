import { useEffect } from "react";

import Form from "../components/Form"

export default function Login(){

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/particles.js"; 
        script.async = true;
        script.onload = () => {
            if (window.particlesJS) {
                window.particlesJS.load("particles-js", "/app.json", function () {
                    console.log("particles.js config loaded");
                });
            }
        };
        document.body.appendChild(script);
    }, []);

    return(
        <>
            <div id="particles-js"></div>
            <Form linkTo="register" route="api/token/" method="login" />
        </>
    )
}