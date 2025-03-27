import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setUserData } from '../../../app/store';

import './SignUpPage.css';
import radioXImage from '../../../images/Radiox-logo.png';

interface UserData {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  gender: string;
  symptoms: string;
  username: string;
  password: string;
  email: string;
}

const SignUpPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserState] = useState<UserData>({
    name: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    gender: '',
    symptoms: '',
    username: '',
    password: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    phoneNumber: '',
    password: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserState((prevData) => ({ ...prevData, [name]: value }));
    // Clear the error message when the user starts typing in the field
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateForm()) {
      return;
    }

    try {
      // Save user data to localStorage for persistence
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Also store credentials in a separate object for login
      localStorage.setItem('userCredentials', JSON.stringify({
        username: userData.username,
        password: userData.password,
        email: userData.email
      }));

      // Dispatch user data to Redux
      dispatch(setUserData(userData));

      console.log('Registration successful, user data stored', userData);

      // Navigate to the login page after successful signup
      navigate('/login');
    } catch (error) {
      console.error('Error storing user data:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const validateForm = () => {
    // Add your validation logic here
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;

    if (!nameRegex.test(userData.name)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, name: 'Please enter a valid name' }));
      valid = false;
    }

    if (!phoneRegex.test(userData.phoneNumber)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, phoneNumber: 'Please enter a valid 10 digit phone number' }));
      valid = false;
    }

    if (!passwordRegex.test(userData.password)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters and include at least one letter and one number' }));
      valid = false;
    }

    if (!emailRegex.test(userData.email)) {
      setFormErrors((prevErrors) => ({ ...prevErrors, email: 'Please enter a valid email address' }));
      valid = false;
    }

    return valid;
  };

  return (
    <div className="signup-page">
      <Link to="/">
        <img src={radioXImage} alt="RadioX Logo" className="radiox-logo" />
      </Link>
      
      <form onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        
        <div className="form-column">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={userData.name} 
            onChange={handleChange} 
            placeholder="Enter your full name"
            required 
          />
          {formErrors.name && <span className="error-message">{formErrors.name}</span>}

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={userData.email} 
            onChange={handleChange} 
            placeholder="Enter your email address"
            required 
          />
          {formErrors.email && <span className="error-message">{formErrors.email}</span>}

          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input 
            type="date" 
            id="dateOfBirth" 
            name="dateOfBirth" 
            value={userData.dateOfBirth} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            name="phoneNumber" 
            value={userData.phoneNumber} 
            onChange={handleChange} 
            placeholder="1234567890"
            required 
          />
          {formErrors.phoneNumber && <span className="error-message">{formErrors.phoneNumber}</span>}
        </div>

        <div className="form-column">
          <label htmlFor="address">Address</label>
          <input 
            type="text" 
            id="address" 
            name="address" 
            value={userData.address} 
            onChange={handleChange} 
            placeholder="Enter your address"
            required 
          />
        
          <label htmlFor="gender">Gender</label>
          <select 
            id="gender" 
            name="gender" 
            value={userData.gender} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="username">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={userData.username} 
            onChange={handleChange} 
            placeholder="Create a username"
            required 
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={userData.password} 
            onChange={handleChange} 
            placeholder="Create a password"
            required 
          />
          {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          
          <label htmlFor="symptoms">Symptoms</label>
          <input 
            type="text" 
            id="symptoms" 
            name="symptoms" 
            value={userData.symptoms} 
            onChange={handleChange} 
            placeholder="Describe your symptoms"
            required 
          />
        </div>

        <div className="bottom-column">
          <button type="submit">Create Account</button>
        </div>
        
        <div className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;