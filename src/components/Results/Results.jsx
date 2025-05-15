import { useLocation, useNavigate } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, totalQuestions } = location.state || { score: 0, totalQuestions: 0 };

  return (
    <div className="results-container">
      <h2>Quiz Complete!</h2>
      <div className="score-display">
        <p>Your Score: {score} out of {totalQuestions}</p>
        <p>Percentage: {((score / totalQuestions) * 100).toFixed(1)}%</p>
      </div>
      <button onClick={() => navigate('/')} className="home-button">
        Back to Home
      </button>
    </div>
  );
};

export default Results; 