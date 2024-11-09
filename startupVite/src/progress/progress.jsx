import checklistIcon from '../assets/checklist.png';
import './progress.css';

export default function Progress() {
  const answers = [
    {
      id: 1,
      question: "How did you feel when you first met each other?",
      answers: {
        Phoebe: "Awesome",
        Spencer: "Great"
      },
      date: "Sep 2, 2024"
    },
  ];

  return (
    <main>
      <div className="title">
        <h2>Answered Questions</h2>
        <img src={checklistIcon} alt="checklist" />
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
          {answers.map((answer) => (
            <tr key={answer.id}>
              <td>{answer.id}</td>
              <td>{answer.question}</td>
              <td>
                Phoebe: {answer.answers.Phoebe}<br />
                Spencer: {answer.answers.Spencer}
              </td>
              <td>{answer.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}