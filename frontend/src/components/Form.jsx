import { useState } from "react"
import { Link } from "react-router"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"

import api from "../api"
import LoadingIndicator from "./LoadingIndicator"

import "../styles/Form.css"

export default function Form({route, method, linkTo}){
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Login" : "Register"

    var firstText = " "
    var secondText = " "
    var formSide = " "
    var imageSide = " "

    if(method === "login"){
        firstText = "Welcome back"
        secondText = "Log in to your account using username and password"
        formSide = "left"
        imageSide = "right"
    } else {
        firstText = "Register"
        secondText = "Create your new account by entering a username and password"
        formSide = "right-2"
        imageSide = "left-2"
    }

    

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try{
            const res = await api.post(route, {username, password})
            if(method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                localStorage.setItem(REFRESH_TOKEN, res.data.access)
                navigate("/")
            }
            else{
                navigate("/login")
            }
        }
        catch(error){
            alert(error)
        }
        finally{
            setLoading(false)
        }
    }

    return( 
        <div className="container">
            {method === "login" ? (
            <>
                <div className={formSide}>
                    <div className="header">
                        <h2 className="animation a1">{firstText}</h2>
                        <h4 className="animation a2">{secondText}</h4>
                    </div>

                    <form onSubmit={handleSubmit} className="form">
                        <input 
                            className="form-field animation a3"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input 
                            className="form-field animation a4"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />

                        {loading && <LoadingIndicator />}

                        <button type="submit" className="animation a6 main-button">
                            {name}
                        </button>

                        <button
                            type="button"         
                            onClick={() => {navigate(`/${linkTo}`)}} 
                            className="animation a6 secondary-button"
                            style={{ marginTop: "10px" }}
                        >
                            {linkTo.charAt(0).toUpperCase() + linkTo.slice(1)}
                        </button>

                    </form>
                </div>

                <div className={imageSide}>
                    {/* You can put your right side image or design here */}
                </div>
            </>
            ):(
            <>
                <div className={imageSide}>
                    {/* You can put your right side image or design here */}
                </div>
                
                <div className={formSide}>
                    <div className="header">
                        <h2 className="animation a1">{firstText}</h2>
                        <h4 className="animation a2">{secondText}</h4>
                    </div>

                    <form onSubmit={handleSubmit} className="form">
                        <input 
                            className="form-field animation a3"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                        <input 
                            className="form-field animation a4"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />

                        {loading && <LoadingIndicator />}

                        <button type="submit" className="animation a6 main-button">
                            {name}
                        </button>

                        <button
                            type="button"         
                            onClick={() => {navigate(`/${linkTo}`)}} 
                            className="animation a6 secondary-button"
                            style={{ marginTop: "10px" }}
                        >
                            {linkTo.charAt(0).toUpperCase() + linkTo.slice(1)}
                        </button>

                    </form>
                </div>

            </>
            )}
        </div>
    )
}