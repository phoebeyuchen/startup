import { useState } from 'react';
import conversationIcon from '../images/conversation.png';
import './chat.css';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "gym?", received: true },
    { id: 2, text: "Sure!", received: false },
    { id: 3, text: "What time?", received: false },
    { id: 4, text: "How about 5:15?", received: true },
    { id: 5, text: "Do you need a ride?", received: true },
    { id: 6, text: "Yes!", received: false }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: message, received: false }]);
      setMessage('');
    }
  };

  return (
    <main>
      <div className="title">
        <h2>Chat Room</h2>
        <img src={conversationIcon} alt="conversation" className="chat-icon"/>
      </div>
      <div id="chat-container">
        <h3>Spencer</h3>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.received ? 'received' : ''}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <form id="chat-form" onSubmit={handleSend}>
          <input
            id="input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit" className='send'>Send</button>
        </form>
      </div>
    </main>
  );
}