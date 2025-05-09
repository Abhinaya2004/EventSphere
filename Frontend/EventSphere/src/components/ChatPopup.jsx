import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../css/chatwidget.css'
import AuthContext from '../context/Auth';

const ChatWidget = () => {
  const { userState } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState([{ sender: "bot", text: "Hi! Ask me about EventSphere." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is not logged in, don't render the chat widget
  if (!userState?.user) {
    return null;
  }

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newChat = [...chat, { sender: "user", text: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", { message: input });
      const botReply = res.data.response;
      setChat([...newChat, { sender: "bot", text: botReply }]);
    } catch (err) {
      setChat([...newChat, { sender: "bot", text: "Oops! Something went wrong." }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-widget-container">
      <button onClick={toggleChat} className="chat-toggle">
        💬
      </button>

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">EventSphere Bot</div>
          <div className="chat-body">
            {chat.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-msg bot">Typing...</div>}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
