import { useState } from "react"
import arrow from "/assets/logo4.svg"

const MessageBar = () => {

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()){
            setMessages([...messages, message]);
            setMessage('')
        }
    }

  return (
    <div>
        <div className="bg-gray-100 p-4 mb-4 rounded-md">
            {messages.map((msg, index) => (
                <div key={index} className="message bg-blue-200 p-2 my-2 rounded-md">
                    {msg}
                </div>
            ))}
        </div>


        
        <form onSubmit={handleSubmit} className="flex">
            <input 
                type="text"
                value={message}
                onChange={handleChange}
                placeholder="Send a message..."
                className="bg-gray-200 w-full p-5 outline-none"
            />
            <button type="submit" className="bg-gray-200 pr-5">
                <img src={arrow} alt="arrow-logo" />
            </button>
        </form>

    </div>
  )
}

export default MessageBar