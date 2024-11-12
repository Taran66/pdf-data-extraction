import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);  // Store selected file in state
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        // Check if a file is selected
        if (!file) return alert("Please select a PDF file");

        // Create a FormData object
        const formData = new FormData();
        formData.append("file", file);  // Append file to the form data

        try {
            // Make a POST request with the file data
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',  // Set content type for file upload
                },
            });
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            console.error('File upload failed:', error);
        }
    };

    return (
        <form onSubmit={handleUpload}>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button type="submit">Upload PDF</button>
        </form>
    );
};

export default FileUpload;
