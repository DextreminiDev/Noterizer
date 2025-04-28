import Form from "../components/Form"

export default function Login(){
    return(
        <Form linkTo="register" route="api/token/" method="login" />
    )
}