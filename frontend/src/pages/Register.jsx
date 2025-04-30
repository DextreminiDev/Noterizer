import { useEffect } from "react";

import Form from "../components/Form"

export default function Register(){

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
            <Form linkTo="login" route="api/user/register/" method="register" />    
        </>
    )
}