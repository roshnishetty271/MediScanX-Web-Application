import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './EmailTest.css';

// EmailJS configuration - same as in PaymentDialog.tsx
const EMAILJS_SERVICE_ID = "service_gy62i9i"; 
const EMAILJS_TEMPLATE_ID = "template_t01y9xj"; 
const EMAILJS_PUBLIC_KEY = "Ui0sSchlmY9aWARxF"; 

const EmailTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setStatus('sending');
    setErrorMessage('');
    
    try {
      // Mock appointment data
      const appointmentData = {
        serviceName: 'MRI Scan',
        date: new Date().toISOString().split('T')[0],
        location: 'New York Medical Center',
        doctorName: 'Dr. John Smith',
        time: '10:30 AM',
        id: `TEST-${Date.now()}`,
        amount: 150.00
      };
      
      // Format the date for display
      const appointmentDate = new Date(appointmentData.date);
      const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Prepare email parameters
      const emailParams = {
        to_email: email,
        from_name: "RadioX Medical Center",
        to_name: name || "Patient",
        service_name: appointmentData.serviceName,
        appointment_date: formattedDate,
        appointment_time: appointmentData.time,
        appointment_location: appointmentData.location,
        doctor_name: appointmentData.doctorName,
        appointment_id: appointmentData.id,
        total_amount: `$${appointmentData.amount.toFixed(2)}`,
        reply_to: "appointments@radiox.com"
      };

      // Send the email using EmailJS
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID, 
        EMAILJS_TEMPLATE_ID, 
        emailParams
      );

      console.log('Email test sent successfully!', result.text);
      setStatus('success');
    } catch (error) {
      console.error('Failed to send test email:', error);
      setStatus('error');
      setErrorMessage('Failed to send email. Check console for details.');
    }
  };

  return (
    <div className="email-test-container">
      <div className="email-test-card">
        <h2>Test Appointment Confirmation Email</h2>
        <p className="description">
          Use this form to test sending a confirmation email without going through the entire appointment booking process.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="send-button"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
        
        {status === 'success' && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>Test email sent successfully to <strong>{email}</strong>!</p>
            <p>Check your inbox (and spam folder) for the confirmation email.</p>
          </div>
        )}
        
        <div className="email-info">
          <h3>What will be sent?</h3>
          <p>A sample appointment confirmation email with the following details:</p>
          <ul>
            <li><strong>Service:</strong> MRI Scan</li>
            <li><strong>Date:</strong> Today's date</li>
            <li><strong>Time:</strong> 10:30 AM</li>
            <li><strong>Location:</strong> New York Medical Center</li>
            <li><strong>Doctor:</strong> Dr. John Smith</li>
            <li><strong>Amount:</strong> $150.00</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailTest; 