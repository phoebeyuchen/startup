import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heartIcon from '../assets/heart.png';
import './home.css';

export default function Home({ setIsLoggedIn, userEmail }) {
  const username = userEmail.split('@')[0];

  return (
    <main>
      <div className="title">
        <h2>Hello, {username}</h2>
        <img src={heartIcon} alt="heart" className="home-icon"/>
      </div>
      
      <div className="question-logout">
        <QuestionButton />
        <LogoutButton setIsLoggedIn={setIsLoggedIn} />
      </div>

    </main>
  );
}

export function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
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
      See Today's Question
    </button>
  );
}
