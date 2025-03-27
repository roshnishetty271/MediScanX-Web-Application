import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../../app/store';
import radioXImage from '../../../images/Radiox-logo.png';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Attempting login with username:", username);
    
    try {
      // Check if user credentials exist in localStorage
      const storedCredentials = localStorage.getItem('userCredentials');
      
      if (!storedCredentials) {
        setError('No user accounts found. Please sign up first.');
        return;
      }
      
      const userCredentials = JSON.parse(storedCredentials);
      
      // Validate username and password
      if (userCredentials.username === username && userCredentials.password === password) {
        // Login successful
        
        // Get full user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          // Parse and dispatch user data to Redux
          const userData = JSON.parse(storedUserData);
          console.log("Loading user data into Redux store:", userData);
          dispatch(setUserData(userData));
          
          // Ensure email is included in userCredentials
          if (userData.email && !userCredentials.email) {
            // Update credentials with email if missing
            userCredentials.email = userData.email;
            localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
            console.log("Updated userCredentials with email:", userCredentials.email);
          }
        } else {
          console.warn("User credentials found but no userData in localStorage");
        }
        
        // Navigate to patient dashboard
        navigate('/patient');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-container">
        <img src={radioXImage} alt="RadioX Logo" className="login-logo" />
      </div>
      <div className="login-form-container">
        <h1 className="login-title">Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 