import React from 'react';
import './Home.css';

const Home = ({ onLogout }) => {
  const handleStartQuiz = (e) => {
    e.preventDefault();
    console.log("Start Quiz clicked");
  };

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
              <select>
                <option>Any Category</option>
                <option>History</option>
                <option>Geography</option>
                <option>Movie </option>
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty:</label>
              <select>
                <option>Easy</option>
                <option>Medium</option>
                <option>Difficult</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Questions:</label>
              <select>
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