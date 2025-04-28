import { Link } from "react-router";

import Form from "../components/Form"
import "../styles/main.css"

export default function Login(){
    return(
        <div className="center">
            <Form linkTo="register" route="api/token/" method="login" />
        </div>
    )
}