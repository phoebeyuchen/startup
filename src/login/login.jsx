import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heartIcon from '../assets/heart.png';
import './login.css';

export default function Login({ setIsLoggedIn, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        // Store token in localStorage for future API calls
        localStorage.setItem('userToken', token);
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('userToken', token);
        setIsLoggedIn(true);
        setUserEmail(email);
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.msg || 'Account creation failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <main>
      <div className="title">
        <h2>Welcome to Bondly</h2>
        <img src={heartIcon} alt="heart" className='home-icon'/>
      </div>
      <form onSubmit={handleLogin} className="user-info">
        <div className="email-password">
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@example.com"
            required
          />
        </div>
        <div className="email-password">
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
        </div>
        <div className="login-create">
          <button type="submit" className="login">Login</button>
          <button type="button" onClick={handleCreate} className="create">Create</button>
        </div>
        {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </main>
  );
}