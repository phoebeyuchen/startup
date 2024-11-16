import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import conversationIcon from '../assets/conversation.png';
import './chat.css';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('/api/messages', {
          headers: {
            'Authorization': token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          const data = await response.json();
          setError(data.msg || 'Failed to load messages');
        }
      } catch (err) {
        setError('Failed to connect to server');
      }
    };

    fetchMessages();
    // In a real application, you would set up WebSocket connection here
    // and clean it up in the return function
  }, [navigate]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ text: message })
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setMessage('');
      } else {
        const data = await response.json();
        setError(data.msg || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <main>
      <div className="title">
        <h2>Chat Room</h2>
        <img src={conversationIcon} alt="conversation" className="chat-icon"/>
      </div>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <div id="chat-container">
        <h3>Messages</h3>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.userEmail === localStorage.getItem('userEmail') ? '' : 'received'}`}>
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