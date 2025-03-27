import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Loginscreen.css';
import Image1 from '../../../images/patient-login.png';
import Image2 from '../../../images/patient-login2.png';
import Image3 from '../../../images/patient-login3.png';
import NavLogo from '../../../images/Radiox-logo.png';

const textData = [
  "Fast and accurate reporting with intelligent tools",
  "Connect and collaborate with the Radiox Team",
  "Instant access to any of our intelligence tools",
];

// Hardcoded admin and doctor credentials for demo
const adminCredentials = {
  username: 'admin',
  password: 'admin123'
};

const doctorCredentials = [
  { username: 'doctor1', password: 'doctor123', name: 'Dr. John Doe' },
  { username: 'doctor2', password: 'doctor123', name: 'Dr. Jane Smith' }
];

const AppContainer: React.FC = () => {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [errorMessage, setErrorMessage] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Define image array with error handling
  const images = [Image1, Image2, Image3];

  // Preload images to ensure they're available before displaying
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const promises = images.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        // Continue even if image loading fails
        setImagesLoaded(true);
      }
    };
    
    preloadImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(false);
    setErrorMessage('');

    // First, check if it's an admin login
    if (userType === 'admin') {
      if (username === adminCredentials.username && password === adminCredentials.password) {
        // Store admin information in local storage
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('username', username);
        
        // Navigate to admin dashboard (you'll need to create this route and component)
        navigate('/admin');
        return;
      } else {
        setError(true);
        setErrorMessage('Invalid admin credentials');
        return;
      }
    }
    
    // Next, check if it's a doctor login
    if (userType === 'doctor') {
      const doctorUser = doctorCredentials.find(
        doctor => doctor.username === username && doctor.password === password
      );
      
      if (doctorUser) {
        // Store doctor information in local storage
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('username', username);
        localStorage.setItem('doctorName', doctorUser.name);
        
        // Navigate to doctor dashboard (you'll need to create this route and component)
        navigate('/doctor');
        return;
      } else {
        setError(true);
        setErrorMessage('Invalid doctor credentials');
        return;
      }
    }
    
    // Finally, handle patient login
    const storedCredentialsString = localStorage.getItem('userCredentials');

    if (storedCredentialsString) {
      const storedCredentials = JSON.parse(storedCredentialsString);

      if (storedCredentials.username === username && storedCredentials.password === password) {
        // Store patient information in local storage
        localStorage.setItem('userRole', 'patient');
        localStorage.setItem('username', storedCredentials.username);

        // Navigate to patient dashboard
        navigate('/patient');
      } else {
        setError(true);
        setErrorMessage('Invalid username or password');
      }
    } else {
      setError(true);
      setErrorMessage('No patient accounts found. Please sign up first');
      console.log('No user credentials found');
    }
  };

  return (
    <div className="app-container">
      <Link to="/">
        <img 
          src={NavLogo} 
          alt="RadioX Logo" 
          className="nav-logo" 
          onError={(e) => {
            e.currentTarget.onerror = null; 
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyI+UmFkaW9YPC90ZXh0Pjwvc3ZnPg==';
          }}
        />
      </Link>
      
      <div className="slideshow-container">
        {imagesLoaded && images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          >
            {index === currentImage && (
              <div className="image-text">
                {textData[currentImage]}
              </div>
            )}
          </div>
        ))}
        <div className="dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={index === currentImage ? 'active' : ''}
              onClick={() => handleDotClick(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="login-container">
        <h2>Login to RadioX</h2>
        
        {error && <div className="error-message">{errorMessage || 'Invalid username or password'}</div>}
        
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="userType">Login As:</label>
            <select 
              id="userType" 
              className="user-type-select"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <button type="submit">Login</button>
          </div>
        </form>
        
        <div className="signup-link">
          {userType === 'patient' && (
            <>Don't have an account? <Link to="/signup">Sign Up</Link></>
          )}
          {userType !== 'patient' && (
            <span className="login-note">Please contact administrator for {userType} account access</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppContainer;