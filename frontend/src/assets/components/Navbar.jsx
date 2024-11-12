import { useState } from "react";
import logo from "/assets/ai_planet_logo.svg";
import plus_sign from "/assets/logo3.svg";
import file_img from "/assets/logo2.svg";
import axios from "axios";

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            await uploadFile(selectedFile)
        } else {
            alert("Please upload a PDF file");
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
            await uploadFile(droppedFile)
        } else {
            alert("Please upload a PDF file");
        }
    };

    const uploadFile = async (selectedFile) => {
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post("http://localhost:8000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("File uploaded successfully:", response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex flex-col justify-between shadow-md p-5">
            <div className="flex justify-between">
                <img src={logo} alt="logo" />
                <div className="flex gap-10">
                    {file && (
                        <div className="flex items-center gap-2">
                            <img src={file_img} alt="pdf" />
                            <p className="text-gray-700">{file.name}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="flex items-center gap-5 border-2 border-black rounded-md p-2"
                    >
                        <img src={plus_sign} alt="plus_sign" />
                        <p>Upload PDF</p>
                    </button>
                </div>
            </div>

            {isVisible && (
                <div
                    className="border-2 border-dashed border-blue-400 rounded-md p-5 mt-5 flex justify-center items-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input
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
