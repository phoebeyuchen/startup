

import React, { useState, useContext } from 'react';
import { AnswersContext } from '../AnswersContext';
import questionIcon from '../images/question.png';
import './question.css';

export default function Question() {
  const { addAnswer } = useContext(AnswersContext);
  const [userAnswer, setUserAnswer] = useState('');

  const handleSave = () => {
    const newAnswer = {
      id: Date.now(),
      question: "How did you feel when you first met each other?",
      answers: {
        User: userAnswer,
      },
      date: new Date().toLocaleDateString(),
    };
    addAnswer(newAnswer);
    setUserAnswer('');
    alert('Saved!');
  };

  return (
    <main>
      <div className="title">
        <h2>Today's Question</h2>
        <img src={questionIcon} alt="question" className="question-icon" />
      </div>
      <p className="question-text">"How did you feel when you first met each other?"</p>
      <div className="textarea-container">
        <textarea
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
        />
        <button onClick={handleSave} className="save">Save</button>
      </div>
    </main>
  );
}