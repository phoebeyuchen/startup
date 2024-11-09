import React, { useContext } from 'react';
import { AnswersContext } from '../AnswersContext';
import checklistIcon from '../images/checklist.png';
import './progress.css';

export default function Progress() {
  const { answers } = useContext(AnswersContext);

  return (
    <main>
      <div className="title">
        <h2>Answered Questions</h2>
        <img src={checklistIcon} alt="checklist" className="progress-icon" />
      </div>
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
              <td>{answer.answers.User}</td>
              <td>{answer.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}