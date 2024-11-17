import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionIcon from '../assets/question.png';
import './question.css';

export default function Question() {
  const [userAnswer, setUserAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Function to transform a quote into a question
  const transformToQuestion = (quote) => {
    const starters = [
      "What do you think about this quote: ",
      "How does this make you feel: ",
      "How can we apply this to our relationship: ",
      "Share a memory that relates to this: ",
      "What does this quote mean to you: "
    ];
    
    // Randomly select a question starter
    const starter = starters[Math.floor(Math.random() * starters.length)];
    return `${starter}"${quote}"`;
  };
  
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/question');
        
        if (!response.ok) {
          throw new Error('Failed to load question');
        }
        
        const data = await response.json();
        const formattedQuestion = transformToQuestion(data.question);
        setQuestion(formattedQuestion);
        setError('');
      } catch (err) {
        setError('Failed to load today\'s question. Please try again later.');
        console.error('Error fetching question:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  const handleSave = async () => {
    if (!userAnswer.trim()) {
      setError('Please enter an answer before saving');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          question: question,
          answer: userAnswer
        })
      });

      if (response.ok) {
        setUserAnswer('');
        setError('');
        alert('Answer saved successfully!');
      } else {
        const data = await response.json();
        throw new Error(data.msg || 'Failed to save answer');
      }
    } catch (err) {
      setError(err.message || 'Failed to save answer. Please try again.');
    }
  };

  return (
    <main>
      <div className="title">
        <h2>Today's Question</h2>
        <img src={questionIcon} alt="question" className="question-icon" />
      </div>
      
      {error && (
        <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </p>
      )}
      
      {isLoading ? (
        <p className="loading" style={{ textAlign: 'center', color: '#6a605c' }}>
          Loading today's question...
        </p>
      ) : (
        <>
          <p className="question-text">{question}</p>
          <div className="textarea-container">
            <textarea
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <button onClick={handleSave} className="save">Save</button>
          </div>
        </>
      )}
    </main>
  );
}