import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heartIcon from '../images/heart.png';
import './login.css';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/welcome');
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
            required
          />
        </div>
        <div className="email-password">
          <label>Password:</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-create">
          <button type="submit" className="login">Login</button>
          <button type="submit" className="create">Create</button>
        </div>
      </form>
    </main>
  );
}