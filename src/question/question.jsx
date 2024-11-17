import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questionIcon from '../assets/question.png';
import './question.css';

export default function Question() {
  const [userAnswer, setUserAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const navigate = useNavigate();
  
  const transformToQuestion = (quote) => {
    const starters = [
      "What do you think about this quote: ",
      "How does this make you feel: ",
      "How can we apply this to our relationship: ",
      "Share a memory that relates to this: ",
      "What does this quote mean to you: "
    ];
    
    const starter = starters[Math.floor(Math.random() * starters.length)];
    return `${starter}"${quote}"`;
  };
  
  useEffect(() => {
    const fetchQuestionAndCheckAnswer = async () => {
      try {
        setIsLoading(true);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // First, check if user has already answered today
        const token = localStorage.getItem('userToken');
        const answersResponse = await fetch('/api/answers', {
          headers: {
            'Authorization': token
          }
        });
        
        if (answersResponse.ok) {
          const answers = await answersResponse.json();
          const todayAnswer = answers.find(answer => {
            const answerDate = new Date(answer.date);
            return answerDate.getDate() === today.getDate() &&
                   answerDate.getMonth() === today.getMonth() &&
                   answerDate.getFullYear() === today.getFullYear();
          });
          
          if (todayAnswer) {
            setHasAnswered(true);
            setUserAnswer(todayAnswer.answer);
          }
        }
        
        // Then fetch today's question
        const storedQuestion = localStorage.getItem('dailyQuestion');
        const storedDate = localStorage.getItem('questionDate');
        
        if (storedQuestion && storedDate && new Date(storedDate).getTime() === today.getTime()) {
          setQuestion(storedQuestion);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch('/api/question');
        
        if (!response.ok) {
          throw new Error('Failed to load question');
        }
        
        const data = await response.json();
        const formattedQuestion = transformToQuestion(data.question);
        
        localStorage.setItem('dailyQuestion', formattedQuestion);
        localStorage.setItem('questionDate', new Date(data.date).toISOString());
        
        setQuestion(formattedQuestion);
        setError('');
      } catch (err) {
        setError('Failed to load today\'s question. Please try again later.');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionAndCheckAnswer();
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
        setHasAnswered(true);
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
              placeholder={hasAnswered ? "You've already answered today's question!" : "Type your answer here..."}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={hasAnswered}
            />
            {!hasAnswered && (
              <button onClick={handleSave} className="save">Save</button>
            )}
          </div>
          {hasAnswered && (
            <p style={{ textAlign: 'center', color: '#6a605c', marginTop: '10px' }}>
              Come back tomorrow for a new question!
            </p>
          )}
        </>
      )}
    </main>
  );
}