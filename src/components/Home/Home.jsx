import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Category mapping to Open Trivia DB category IDs
const CATEGORIES = {
  'Any Category': '',
  'General Knowledge': 9,
  'Books': 10,
  'Film': 11,
  'Music': 12,
  'Television': 14,
  'Video Games': 15,
  'Science & Nature': 17,
  'Computers': 18,
  'Mathematics': 19,
  'Sports': 21,
  'Geography': 22,
  'History': 23,
  'Politics': 24,
  'Art': 25,
  'Animals': 27,
  'Vehicles': 28,
  'Comics': 29,
  'Gadgets': 30,
  'Anime & Manga': 31,
  'Cartoons': 32
};

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [quizOptions, setQuizOptions] = useState({
    category: 'Any Category',
    difficulty: 'easy',
    amount: 10
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartQuiz = (e) => {
    e.preventDefault();
    
    // Pass quiz options to the quiz page via state
    navigate('/quiz', { 
      state: {
        category: CATEGORIES[quizOptions.category],
        difficulty: quizOptions.difficulty.toLowerCase(),
        amount: Number(quizOptions.amount)
      }
    });
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
              <select name="category" value={quizOptions.category} onChange={handleChange}>
                {Object.keys(CATEGORIES).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Difficulty:</label>
              <select name="difficulty" value={quizOptions.difficulty} onChange={handleChange}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Questions:</label>
              <select name="amount" value={quizOptions.amount} onChange={handleChange}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
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