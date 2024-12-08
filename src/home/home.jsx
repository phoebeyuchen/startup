import { useNavigate } from 'react-router-dom';
import heartIcon from '../assets/heart.png';
import { PartnerConnection } from '../partner/partner';
import './home.css';

export default function Home({ setIsLoggedIn, userEmail }) {
  const username = userEmail.split('@')[0];
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleQuestion = () => {
    navigate('/question');
  };

  return (
    <main>
      <div className="title">
        <h2>Hello, {username}</h2>
        <img src={heartIcon} alt="heart" className="home-icon"/>
      </div>
      
      <PartnerConnection />
      
      <div className="question-logout">
        <button onClick={handleQuestion} className="question">
          See Today's Question
        </button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </main>
  );
}