import React from 'react';
import './Results.css';

const Results = ({ score, totalQuestions, onPlayAgain }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getMessage = () => {
    if (percentage >= 90) return "Outstanding! You're a trivia master! ";
    if (percentage >= 70) return "Great job! You really know your stuff! ";
    if (percentage >= 50) return "Good effort! Keep practicing!";
    return "Keep learning! You'll do better next time!";
  };

  return (
    <div className="results-container">
      <h2>Quiz Complete!</h2>
      <div className="score-circle">
        <div className="score-percentage">{percentage}%</div>
        <div className="score-text">
          {score} / {totalQuestions}
        </div>
      </div>
      <p className="result-message">{getMessage()}</p>
      <button className="play-again-button" onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  );
};

export default Results; 