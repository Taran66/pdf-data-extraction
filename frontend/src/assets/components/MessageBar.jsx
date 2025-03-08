import { useState } from "react"
import arrow from "/assets/logo4.svg"
import axios from "axios"
import { TypeAnimation } from 'react-type-animation';
import askify from '/assets/askify.png'
import userImage from '/assets/logo1.svg'
import Navbar from "./Navbar";

const MessageBar = () => { 

    const [message, setMessage] = useState('') // Making a state for the message
    const [conversation, setConversation] = useState([]) // Making a state for the conversation storing both the user and the bot

    const handleChange = (e) => { // Function to handle the change in the message
        setMessage(e.target.value);

        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
    }

    const handleSubmit = async (e) => { // Function to handle the submission of the message
        const url = import.meta.env.VITE_API_URL
        e.preventDefault();
        if (message.trim()) {
          const userMessage = { type: "user", text: message };
          setConversation((prev) => [...prev, userMessage]);
          setMessage('');
    
          try {
            const response = await axios.post(`${url}/chat`, { question: message }); // Sending the message to the backend using axios
            const botReply = { type: "bot", text: response.data.answer }; // Setting the state for the bot reply
            setConversation((prev) => [...prev, botReply]);
          } catch (error) { // If there is an error
            console.error("Error sending message: ", error);
            alert("Failed to send message. Please try again");
          }
        }
      };

  return (
    <div>

<div className="flex flex-col h-[100svh] py-4 ">
    <Navbar />
        <div className="p-5 overflow-y-scroll h-full">
          {conversation.map((msg, index) => ( // Mapping the conversation
            <div
              key={index}
              className="p-4 my-4 rounded-md text-black font-normal text-left"
            >
                <img src="" alt="" />
                {msg.type === "bot" ? ( // Checking if the message is from the bot
                <div className="flex">
                    <img src={askify} alt="ai-logo" className="w-8 h-8 mr-2" />
                    <TypeAnimation // Using react-type-animation to animate the text
                    className="text-black"
                    sequence={[msg.text]} // response from the bot
                    wrapper="span"
                    cursor={true}
                    speed={100}
                    />
                </div>
                ) : ( // If the message is from the user display the text
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


{/* <div className="flex flex-col h-screen">
  <div className="flex-1 overflow-y-auto px-4">
    {conversation.map((msg, index) => (
      <div 
        key={index} 
        className="p-3 my-2 rounded-md text-black font-normal text-left"
      >
        <img src="" alt="" />
        {msg.type === "bot" ? (
          <div className="flex items-start">
            <img src={aiplanet} alt="ai-logo" className="w-6 h-6 mr-2" />
            <div 
              className="text-black"
              sequence={[msg.text]}
              wrapper="span"
              cursor={true}
              speed={100}
            />
          </div>
        ) : (
          <div className="flex items-start">
            <img src={userImage} alt="user-logo" className="w-6 h-6 mr-2" />
            <div>{msg.text}</div>
          </div>
        )}
      </div>
    ))}
  </div>
  
  <div className="p-4">
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="Send a message..."
        className="flex-1 p-3 outline-none bg-slate-200 rounded-l"
      />
      <button type="submit" className="px-4 bg-slate-200 rounded-r">
        <img src={arrow} alt="arrow-logo" />
      </button>
    </form>
  </div>
</div> */}