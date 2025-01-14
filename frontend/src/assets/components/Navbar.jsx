import { useState } from "react";
import logo from "/assets/ai_planet_logo.svg";
import plus_sign from "/assets/logo3.svg";
import file_img from "/assets/logo2.svg";
import axios from "axios"; 

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);  // Making a state for the visibility of the pdf uploading area
    const [file, setFile] = useState(null); // Making a state for the uploaded file

 
    const handleFileChange = async (e) => { // Function to handle the file upload
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") { // Checking if the selected file is a PDF
            setFile(selectedFile); // Setting the state for the uploaded file
            await uploadFile(selectedFile)
        } else {  // If the selected file is not a PDF
            alert("Please upload a PDF file");
        }
    };

    const handleDrop = async (e) => { // Function to handle the file drop
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];  
        if (droppedFile && droppedFile.type === "application/pdf") { // Checking if the dropped file is a PDF
            setFile(droppedFile); // Setting the state for the uploaded file
            await uploadFile(droppedFile)
        } else { // If the dropped file is not a PDF
            alert("Please upload a PDF file");
        }
    };

    const uploadFile = async (selectedFile) => { // Function to upload the file
        const formData = new FormData();
        const url = import.meta.env.VITE_API_URL
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(`${url}/upload`, formData, { // Sending the file to the backend using axios
                headers: { "Content-Type": "multipart/form-data" }, // Setting the content type to multipart/form-data
            });
            console.log("File uploaded successfully:", response.data);
        } catch (error) { // If there is an error
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex flex-col justify-between shadow-md p-5">
            <div className="flex justify-between">
                <img src={logo} alt="logo" /> 
                <div className="flex gap-10">
                    {file && ( // Rendering the uploaded file
                        <div className="flex items-center gap-2">
                            <img className="pl-5" src={file_img} alt="pdf" />
                            <p className="text-gray-700">{file.name}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsVisible(!isVisible)} // Toggling the visibility of the pdf uploading area
                        className="flex items-center gap-5 border-2 border-black rounded-md p-2"
                    >
                        <img src={plus_sign} alt="plus_sign" />
                        <p className="hidden md:block">Upload PDF</p>
                    </button>
                </div>
            </div>

            {isVisible && ( // Rendering the pdf uploading area
                <div
                    className="border-2 border-dashed border-blue-400 rounded-md p-5 mt-5 flex justify-center items-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input // Input element for file upload
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-blue-500 hover:underline"
                    >
                        Drag & drop a PDF here, or click to upload
                    </label>
                </div>
            )}
        </div>
    );
};

export default Navbar;
