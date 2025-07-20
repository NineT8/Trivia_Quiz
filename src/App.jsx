import React, { useState } from "react";
import Home from "./Components/Home/Home_tem";
import Login from "./Components/Login/Login";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      {loggedIn ? <Home onLogout={() => setLoggedIn(false)} /> : <Login onLoginSuccess={() => { console.log("Login success!"); setLoggedIn(true); }} />}
    </>
  );
}

export default App;
