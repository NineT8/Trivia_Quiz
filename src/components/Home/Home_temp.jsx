import React, { useState } from 'react';
import './Home.css';
import Quiz from '../Quiz/Quiz';
import Results from '../Results/Results';

const Home = ({ onLogout }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    category: 'Any Category',
    difficulty: 'Easy',
    questionCount: '10'
  });
  const [finalScore, setFinalScore] = useState(0);

  const handleStartQuiz = (e) => {
    e.preventDefault();
    setQuizStarted(true);
  };

  const handleQuizComplete = (score) => {
    setQuizCompleted(true);
    setFinalScore(score);
  };

  const handlePlayAgain = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setFinalScore(0);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setQuizConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (quizCompleted) {
    return (
      <div className="home-outer">
        <nav className="navbar">
          <div className="navbar-brand">Trivia Quiz</div>
          <div className="navbar-actions">
            <button className="navbar-logout" onClick={onLogout}>Logout</button>
          </div>
        </nav>
        <Results 
          score={finalScore} 
          totalQuestions={parseInt(quizConfig.questionCount)} 
          onPlayAgain={handlePlayAgain}
        />
      </div>
    );
  }

  if (quizStarted) {
    return (
      <div className="home-outer">
        <nav className="navbar">
          <div className="navbar-brand">Trivia Quiz</div>
          <div className="navbar-actions">
            <button className="navbar-logout" onClick={onLogout}>Logout</button>
          </div>
        </nav>
        <Quiz 
          category={quizConfig.category}
          difficulty={quizConfig.difficulty}
          questionCount={quizConfig.questionCount}
          onQuizComplete={handleQuizComplete}
        />
      </div>
    );
  }

  return (
    <div className="home-outer">
      <nav className="navbar">
        <div className="navbar-brand">Trivia Quiz</div>
        <ul className="navbar-links">
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
        </ul>
        <div className="navbar-actions">
          <button className="navbar-logout" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <div className="home-container">
        <div className="home-box">
          <h1 className="home-title">Quiz Quest Arcade</h1>
          <p className="home-subtitle">Test your knowledge with fun trivia questions!</p>
          <form className="home-form" onSubmit={handleStartQuiz}>
            <div className="form-group">
              <label>Category:</label>
              <select 
                name="category"
                value={quizConfig.category}
                onChange={handleConfigChange}
              >
                <option>Any Category</option>
                <option>History</option>
                <option>Sports</option>
                <option>Science</option>
                <option>Math</option>
                <option>Art</option>
                <option>Music</option>
                <option>Movies</option>
                <option>TV</option>
                <option>Geography</option>
                <option>Gernal knowledge</option>
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty:</label>
              <select 
                name="difficulty"
                value={quizConfig.difficulty}
                onChange={handleConfigChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Difficult</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Questions:</label>
              <select 
                name="questionCount"
                value={quizConfig.questionCount}
                onChange={handleConfigChange}
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
              </select>
            </div>
            <button className="home-button" type="submit">Start Quiz</button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <p>2025 Trivia Quiz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
