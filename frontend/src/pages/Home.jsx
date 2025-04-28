import { useState } from "react";

import api from "../api";

import "../styles/Form.css"
import "../styles/main.css"

function Home() {
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
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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
                responseType: 'blob'
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
        <div className="center" style={{ padding: "20px" }}>
            <h2>Upload and Process Files</h2>
            <input type="file" onChange={handleFileChange} multiple /> {}
            <br />
            <button 
                onClick={handleUpload} 
                disabled={loading || files.length === 0}
                style={{ marginTop: "10px" }}
            >
                {loading ? "Processing..." : "Upload"}
            </button>

            {outputFiles.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Download Outputs</h3>
                    {outputFiles.map((filename) => (
                        <div key={filename} style={{ margin: "10px 0" }}>
                            <button 
                                onClick={() => handleDownload(filename)}
                                style={{ 
                                    padding: "5px 10px", 
                                    cursor: "pointer",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px"
                                }}
                            >
                                Download {filename}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;