import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heartIcon from '../images/heart.png';
import './welcome.css';

export default function Welcome({ setIsLoggedIn }) {

  return (
    <main>
      <div className="title">
        <h2>Welcome to Bondly</h2>
        <img src={heartIcon} alt="heart" className="home-icon"/>
      </div>
    
      <div className="login-create">
        <QuestionButton />
        <LogoutButton setIsLoggedIn={setIsLoggedIn} />
      </div>

    </main>
  );
}

export function LogoutButton({ setIsLoggedIn }) {
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <button onClick={handleLogout} className="logout">
      Logout
    </button>
  );
}

function QuestionButton() {
  const navigate = useNavigate();

  const handleQuestion = () => {
    navigate('/question');
  };

  return (
    <button onClick={handleQuestion} className="question">
      Question
    </button>
  );
}
