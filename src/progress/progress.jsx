import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import checklistIcon from '../assets/checklist.png';
import './progress.css';

export default function Progress() {
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          navigate('/');
          return;
        }

        const response = await fetch('/api/answers', {
          headers: {
            'Authorization': token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAnswers(data);
        } else {
          const data = await response.json();
          setError(data.msg || 'Failed to load answers');
        }
      } catch (err) {
        setError('Failed to connect to server');
      }
    };

    fetchAnswers();
  }, [navigate]);

  return (
    <main>
      <div className="title">
        <h2>Answered Questions</h2>
        <img src={checklistIcon} alt="checklist" className="progress-icon" />
      </div>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Answer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((answer, index) => (
            <tr key={answer.id}>
              <td>{index + 1}</td>
              <td>{answer.question}</td>
              <td>{answer.answer}</td>
              <td>{new Date(answer.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}