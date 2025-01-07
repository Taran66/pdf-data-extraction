import { useState } from "react"
import arrow from "/assets/logo4.svg"
import axios from "axios"
import { TypeAnimation } from 'react-type-animation';
import aiplanet from '/assets/ai_planet.svg'
import userImage from '/assets/logo1.svg'
import Navbar from "./Navbar";

const MessageBar = () => {

    const [message, setMessage] = useState('')
    const [conversation, setConversation] = useState([])

    const handleChange = (e) => {
        setMessage(e.target.value);

        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim()) {
          const userMessage = { type: "user", text: message };
          setConversation((prev) => [...prev, userMessage]);
          setMessage('');
    
          try {
            const response = await axios.post("http://localhost:8000/chat", { question: message });
            const botReply = { type: "bot", text: response.data.answer };
            setConversation((prev) => [...prev, botReply]);
          } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again");
          }
        }
      };

  return (
    <div>

<div className="flex flex-col justify-between h-screen overflow-hidden py-4">
    <Navbar />
        <div className="p-5 overflow-y-scroll h-full">
          {conversation.map((msg, index) => (
            <div
              key={index}
              className="p-4 my-4 rounded-md text-black font-normal text-left"
            >
                <img src="" alt="" />
                {msg.type === "bot" ? (
                <div className="flex">
                    <img src={aiplanet} alt="ai-logo" className="w-8 h-8 mr-2" />
                    <TypeAnimation
                    sequence={[msg.text]}
                    wrapper="span"
                    cursor={true}
                    speed={100}
                    />
                </div>
                ) : (
                <div className="flex">
                    <img src={userImage} alt="user-logo" className="w-8 h-8 mr-2" />
                    {msg.text}
                </div>
                )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex mt-5 ">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder="Send a message..."
            className="w-full p-5 outline-none bg-slate-200"
          />
          <button type="submit" className=" pr-5 bg-slate-200">
            <img src={arrow} alt="arrow-logo" />
          </button>
        </form>
      </div>

    </div>
  )
}

export default MessageBar
