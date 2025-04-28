import Form from "../components/Form"

export default function Register(){
    return(
        <Form linkTo="login" route="api/user/register/" method="register" />
    )
}