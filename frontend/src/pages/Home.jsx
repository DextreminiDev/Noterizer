import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN } from "../constants";

import api from "../api";
import "../styles/Home.css";


function getRandomGreeting() {
    const greetings = [
      "Hi,",
      "Hey,",
      "Welcome back,",
      "Good to see you,",
      "Yo,",
      "Howdy,",
      "Nice to have you here,",
      "Sup,",
      "What's up,",
      "Ahoy,",
      "Hello again,",
      "Glad you're here,",
      "Hey hey,",
      "Hola,",
      "Bonjour,",
      "Greetings,",
      "Hey there,",
      "Long time no see,",
      "Look who's here,",
      "Top of the morning,",
      "Namaste,",
      "Wassup,",
      "Good to have you back,",
      "Oi,",
      "Welcome aboard,",
      "Salutations,",
      "You made it,",
      "Ready to crush it,",
      "Let's do this,",
      "Always a pleasure,",
      "Back again, I see,",
      "Nice seeing you,",
      "You're here! Awesome,"
    ];
  
    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}

export default function Home() {
    const [files, setFiles] = useState([]);
    const [outputFiles, setOutputFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");

    const navigate = useNavigate()


    useEffect(() => {
      api.get("/api/user/me/")
        .then(res => setUsername(res.data.username))
        .catch(err => console.error("Failed to fetch username", err));
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/particles.js"; // from public folder
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

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("No files selected!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const res = await api.post("/api/upload/", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 200) {
                alert("Files uploaded and processed!");
                setOutputFiles(res.data.output_filenames);
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error(error);
            alert("Error uploading files!");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await api.get(`/api/download/${filename}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(url);
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
            alert("Error downloading file!");
        }
    };

    return (
        <>
            <div id="particles-js"></div>
            <div className="home-container">
                <button
                    type="button"         
                    onClick={() => {navigate(`/logout`)}} 
                    className="logout-button"
                >
                    Logout
                </button>
                <div className="top-left-title">
                    Noterizer
                </div>
                <h1 className="title">{`${getRandomGreeting()} ${username}`}</h1>
                <p className="subtitle">Notes Generation and Management Application</p>
                <p className="tagline">One Click. Perfect Notes. Every Time.</p>

                <div className="file-input-section">
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Choose Files
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="file-input-hidden"
                    />
                    {files.length > 0 && (
                        <div className="file-list">
                            {files.map((file, index) => {
                                const ext = file.name.split('.').pop().toLowerCase();
                                let icon = "📄";

                                if (["png", "jpg", "jpeg", "gif"].includes(ext)) icon = "🖼️";
                                else if (["pdf"].includes(ext)) icon = "📕";
                                else if (["doc", "docx"].includes(ext)) icon = "📝";
                                // else if (["ppt", "pptx"].includes(ext)) icon = "📊";
                                // else if (["zip", "rar"].includes(ext)) icon = "📦";

                                return (
                                    <div className="file-entry" key={index}>
                                    <span className="file-emoji">{icon}</span>
                                    <span className="file-name">{file.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <div className="buttons">
                        <button onClick={handleUpload} disabled={loading || files.length === 0} className="upload-btn">
                            {loading ? "Processing..." : "Process"}
                        </button>
                        {outputFiles.length > 0 && (
                            <button onClick={() => {handleDownload(outputFiles[0])}} className="download-btn">
                                Download
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
