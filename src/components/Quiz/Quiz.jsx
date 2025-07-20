import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({ category, difficulty, questionCount, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&deg;/g, "°")
      .replace(/&eacute;/g, "é")
      .replace(/&ldquo;/g, '"')
      .replace(/&rdquo;/g, '"');
  };

  const shuffleArray = (array) => {
    if (!Array.isArray(array)) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      setScore(0);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setIsAnswered(false);

      const categoryMap = {
        'Any Category': 'general',
        'History': 'history',
        'Geography': 'geography',
        'Gernal knowledge': 'general'
      };

      const difficultyMap = {
        'Easy': 'easy',
        'Medium': 'medium',
        'Difficult': 'hard'
      };

      const apiCategory = categoryMap[category] || 'general';
      const apiDifficulty = difficultyMap[difficulty] || 'easy';

      const response = await fetch(
        `https://the-trivia-api.com/api/questions?limit=${questionCount}&categories=${apiCategory}&difficulty=${apiDifficulty}`
      );

      if (!response.ok) {
        throw new Error('Could not fetch questions. Please try again.');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No questions found. Try different settings.');
      }

      const processedQuestions = data.map(q => ({
        ...q,
        question: cleanText(q.question),
        correctAnswer: cleanText(q.correctAnswer),
        incorrectAnswers: q.incorrectAnswers.map(cleanText)
      }));

      setQuestions(processedQuestions);
      setShuffledAnswers(shuffleArray([
        processedQuestions[0].correctAnswer,
        ...processedQuestions[0].incorrectAnswers
      ]));
      setTimeLeft(30);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError(err.message || 'An error occurred while loading questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [category, difficulty, questionCount]);

  useEffect(() => {
    let timer;
    if (timeLeft > 0 && !isAnswered) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !isAnswered) {
      handleNextQuestion();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isAnswered]);

  const handleAnswerSelect = (answer) => {
    if (isAnswered || !questions[currentQuestion]) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (!questions.length) return;

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setShuffledAnswers(shuffleArray([
        questions[nextQuestion].correctAnswer,
        ...questions[nextQuestion].incorrectAnswers
      ]));
      setTimeLeft(30);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onQuizComplete(score);
    }
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="error">
          <p>{error}</p>
          <button className="retry-button" onClick={fetchQuestions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length || !questions[currentQuestion]) {
    return (
      <div className="quiz-container">
        <div className="error">
          <p>No questions available. Please try different settings.</p>
          <button className="retry-button" onClick={fetchQuestions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="quiz-timer">
          Time Left: {timeLeft}s
        </div>
        <div className="quiz-score">
          Score: {score}
        </div>
      </div>
      
      <div className="question-container">
        <h2 className="question-text">{currentQ.question}</h2>
        <div className="answers-grid">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={`${currentQuestion}-${index}`}
              className={`answer-button ${
                selectedAnswer === answer
                  ? answer === currentQ.correctAnswer
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleAnswerSelect(answer)}
              disabled={isAnswered}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      {isAnswered && (
        <button 
          className="next-button" 
          onClick={handleNextQuestion}
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
};

export default Quiz; 