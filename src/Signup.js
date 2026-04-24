import React, { useState } from "react";
import "./App.css";

function Signup({ onSignup, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!username || !email || !password) {
      alert("Fill all fields");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ username, email, password })
    );

    alert("Signup successful!");
    onSignup();
  };

  return (
    <div className="container">
      <h2>Signup</h2>

      <div className="form">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup}>Signup</button>
      </div>

      <p className="switch" onClick={switchToLogin}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Signup;