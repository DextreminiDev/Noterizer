import { useState } from "react";
import api from "../api";
import "../styles/Home.css";

export default function Home() {
    const [files, setFiles] = useState([]);
    const [outputFiles, setOutputFiles] = useState([]);
    const [loading, setLoading] = useState(false);

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
        <div className="home-container">
            <h1 className="title">NOTERIZER</h1>
            <p className="subtitle">Notes Generation and Management Application</p>
            <p className="tagline">One Click. Perfect Notes. Every Time.</p>

            <div className="file-input-section">
                {/* <label for="file-upload" class="custom-file-upload">
                    Custom Upload
                </label>
                <input id="file-upload" onChange={handleFileChange} type="file" multiple className="file-input"/> */}
                <input type="file" onChange={handleFileChange} multiple className="file-input" />
                <div className="buttons">
                    <button onClick={handleUpload} disabled={loading || files.length === 0} className="upload-btn">
                        {loading ? "Processing..." : "Process"}
                    </button>
                    {outputFiles.length > 0 && (
                        <button onClick={() => handleDownload(outputFiles[0])} className="download-btn">
                            Download
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
