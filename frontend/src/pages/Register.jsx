import Form from "../components/Form"
import "../styles/main.css"

export default function Register(){
    return(
        <div className="center">
            <Form linkTo="login" route="api/user/register/" method="register" />
        </div>
    )
}