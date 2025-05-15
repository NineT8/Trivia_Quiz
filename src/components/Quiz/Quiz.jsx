import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const location = useLocation();
  const quizOptions = location.state || { category: '', difficulty: 'easy', amount: 10 };
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('triviaToken') || '');
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Get or reset session token
  const getSessionToken = async (resetToken = false) => {
    try {
      if (sessionToken && !resetToken) {
        return sessionToken;
      }

      // Reset token if needed
      if (resetToken && sessionToken) {
        console.log("Resetting API session token");
        await fetch(`https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`);
      }

      // Request a new token
      console.log("Requesting new API session token");
      const response = await fetch('https://opentdb.com/api_token.php?command=request');
      const data = await response.json();

      if (data.response_code === 0) {
        const newToken = data.token;
        localStorage.setItem('triviaToken', newToken);
        setSessionToken(newToken);
        return newToken;
      } else {
        console.error("Failed to get session token:", data);
        return '';
      }
    } catch (error) {
      console.error("Error getting session token:", error);
      return '';
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async (resetToken = false) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get or reset token
      const token = await getSessionToken(resetToken);
      
      // Build API URL with token to prevent duplicate questions and include options
      let apiUrl = `https://opentdb.com/api.php?amount=${quizOptions.amount}`;
      
      // Add category if specified
      if (quizOptions.category) {
        apiUrl += `&category=${quizOptions.category}`;
      }
      
      // Add difficulty if not 'any'
      if (quizOptions.difficulty !== 'any') {
        apiUrl += `&difficulty=${quizOptions.difficulty}`;
      }
      
      // Always use multiple choice questions
      apiUrl += `&type=multiple`;
      
      // Add token to prevent duplicate questions
      if (token) {
        apiUrl += `&token=${token}`;
      }
      
      console.log('Fetching questions from API:', apiUrl);
      
      // Add delay with exponential backoff if retrying
      const backoffDelay = retryCount > 0 ? Math.min(2000 * Math.pow(2, retryCount - 1), 10000) : 0;
      if (backoffDelay > 0) {
        console.log(`Waiting ${backoffDelay}ms before retrying (attempt ${retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
      
      // Set timeout to handle slow connections
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(apiUrl, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId); // Clear the timeout if response received
      
      if (!response.ok) {
        if (response.status === 429) {
          setRetryCount(prev => prev + 1);
          const waitTime = retryCount > 0 ? Math.min(2000 * Math.pow(2, retryCount), 30000) : 2000;
          setError(`Rate limit exceeded. Waiting ${waitTime/1000} seconds before trying again automatically...`);
          
          // Auto-retry with exponential backoff
          setTimeout(() => {
            fetchQuestions(resetToken);
          }, waitTime);
          return;
        }
        throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
      }
      
      // Reset retry count on success
      setRetryCount(0);
      
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.response_code === 0 && data.results && data.results.length > 0) {
        console.log('Questions loaded successfully:', data.results.length);
        setQuestions(data.results);
      } else if (data.response_code === 4) {
        // Token expired, get a new one and retry
        console.log('Token expired, resetting and retrying');
        if (!resetToken) {
          return fetchQuestions(true);
        } else {
          setError('Error: Unable to retrieve questions. Please try again later.');
        }
      } else {
        console.error('API returned error or empty results:', data);
        
        // More detailed error message based on response code
        let errorMsg = 'The quiz API returned invalid data. Please try again.';
        if (data.response_code === 1) {
          errorMsg = 'No results found. The API could not find enough questions.';
        } else if (data.response_code === 2) {
          errorMsg = 'Invalid parameter in API request.';
        } else if (data.response_code === 3) {
          errorMsg = 'Token error with the API request.';
        }
        
        setError(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      
      // Handle different types of errors
      let errorMessage = 'Could not connect to the quiz server';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. The server took too long to respond.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('Manually retrying question fetch...');
    setRetryCount(0); // Reset retry count on manual retry
    // Add a delay before retrying to avoid rate limits
    setTimeout(() => {
      fetchQuestions();
    }, 2000);
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    if (selectedAnswer === currentQ.correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Save score to history
      const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      history.push({
        score,
        date: new Date().toISOString(),
        totalQuestions: questions.length
      });
      localStorage.setItem('quizHistory', JSON.stringify(history));
      
      // Navigate to results page
      navigate('/results', { state: { score, totalQuestions: questions.length } });
    }
  };

  if (loading) return (
    <div className="quiz-container loading-container">
      <div className="spinner"></div>
      <p>Loading quiz questions...</p>
      <p className="loading-subtext">This may take a moment. Please wait.</p>
    </div>
  );
  if (error) return (
    <div className="quiz-container error-container">
      <h2>Unable to Load Questions</h2>
      <p>{error}</p>
      <button onClick={handleRetry} className="retry-button">Try Again</button>
    </div>
  );
  if (questions.length === 0) return <div className="quiz-container">No questions available</div>;

  const currentQ = questions[currentQuestion];
  const answers = [...currentQ.incorrect_answers, currentQ.correct_answer]
    .sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <h2>Question {currentQuestion + 1} of {questions.length}</h2>
      <div className="question-card">
        <h3 dangerouslySetInnerHTML={{ __html: currentQ.question }} />
        <div className="answers-grid">
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(answer)}
              className="answer-button"
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          ))}
        </div>
      </div>
      <div className="score">Current Score: {score}</div>
    </div>
  );
};

export default Quiz; 