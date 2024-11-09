// AnswersContext.js
import React, { useState, createContext } from 'react';

export const AnswersContext = createContext();

export function AnswersProvider({ children }) {
  const [answers, setAnswers] = useState([]);

  const addAnswer = (newAnswer) => {
    setAnswers((prevAnswers) => [...prevAnswers, newAnswer]);
  };

  return (
    <AnswersContext.Provider value={{ answers, addAnswer }}>
      {children}
    </AnswersContext.Provider>
  );
}