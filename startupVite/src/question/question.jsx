import questionIcon from '../assets/question.png';
import './question.css';

export default function Question() {
  const handleSave = () => {
  };

  return (
    <main>
      <div className="title">
        <h2>Today's Question</h2>
        <img src={questionIcon} alt="question" />
      </div>
      <p>"How did you feel when you first met each other?"</p>
      <div className="textarea-container">
        <textarea placeholder="Type your answer here..." />
        <button onClick={handleSave} className='save'>Save</button>
      </div>
    </main>
  );
}