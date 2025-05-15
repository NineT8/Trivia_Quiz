import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Quiz from "./components/Quiz/Quiz";
import Results from "./components/Results/Results";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          loggedIn ? 
            <Home onLogout={() => setLoggedIn(false)} /> : 
            <Login onLoginSuccess={() => { console.log("Login success!"); setLoggedIn(true); }} />
        } />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;