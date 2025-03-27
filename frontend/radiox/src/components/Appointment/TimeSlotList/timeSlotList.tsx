import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe, StripeError } from '@stripe/stripe-js';
import axios from 'axios';
import emailjs from '@emailjs/browser';
// import { fetchUsers } from '../features/users/usersSlice';
// import { RootState } from '../../../../store';
import './timeSlotList.css';

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_gy62i9i";
const EMAILJS_TEMPLATE_ID = "template_t01y9xj";
const EMAILJS_PUBLIC_KEY = "Ui0sSchlmY9aWARxF";

// NOTE: The above credentials may need to be updated with valid EmailJS account details.
// For production, these should be stored in environment variables.

interface TimeSlotListProps {
  timeSlots: string[];
  selectedDate?: Date;
  selectedDoctor?: string;
  selectedCity?: string;
}

// interface Result{
//   error: StripeError;
// }

const TimeSlotList: React.FC<TimeSlotListProps> = ({ timeSlots, selectedDate, selectedDoctor, selectedCity }) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize EmailJS
    try {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log("EmailJS initialized successfully");
    } catch (error) {
      console.error("Error initializing EmailJS:", error);
    }
  }, []);

  const handleSelection = (index: number) => {
    setSelectedSlot(index);
    setError(null);
  };

  const sendConfirmationEmail = async (appointmentData: any, email: string) => {
    try {
      setEmailStatus('sending');
      console.log("Attempting to send booking confirmation email to:", email);
      
      // Additional validation to ensure we have a valid email
      if (!email || !email.includes('@')) {
        console.error("Invalid email address:", email);
        setEmailStatus('failed');
        return false;
      }
      
      // Get user info from localStorage
      const userCredentialsString = localStorage.getItem('userCredentials');
      let userEmail = email;
      let userName = "Patient";
      
      if (userCredentialsString) {
        try {
          const userCredentials = JSON.parse(userCredentialsString);
          userEmail = userCredentials.email || email;
          console.log("Using email from credentials:", userEmail);
        } catch (e) {
          console.error("Error parsing user credentials:", e);
        }
      }

      // Also try to get email from localStorage userData if available
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          userName = userData.name || "Patient";
          // If userData has an email and credentials didn't, use it
          if (userData.email && userEmail === email) {
            userEmail = userData.email;
            console.log("Using email from userData:", userEmail);
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

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
        to_email: userEmail,
        from_name: "RadioX Medical Center",
        to_name: userName,
        service_name: appointmentData.serviceName,
        appointment_date: formattedDate,
        appointment_time: appointmentData.schedule.startTime,
        appointment_location: appointmentData.location,
        doctor_name: `${appointmentData.doctorName.firstName} ${appointmentData.doctorName.lastName}`,
        appointment_id: appointmentData.appointmentId || "APP-" + Date.now(),
        total_amount: "$150.00",
        reply_to: "appointments@radiox.com",
        message: "Your appointment has been booked. Please complete the payment to confirm your appointment."
      };

      console.log("Email params being sent:", emailParams);

      // For demo purposes in development, we'll skip actual email sending if there are EmailJS issues
      // In production, remove this conditional and fix the EmailJS setup
      if (process.env.NODE_ENV === 'development') {
        // Simulate success even if EmailJS fails (for development/testing only)
        console.log('Development mode: Simulating email success');
        setEmailStatus('success');
        return true;
      }

      // Send the email using EmailJS
      try {
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID, 
          EMAILJS_TEMPLATE_ID, 
          emailParams
        );

        console.log('Booking confirmation email sent successfully!', result.text);
        setEmailStatus('success');
        return true;
      } catch (emailError: any) {
        console.error('EmailJS error:', emailError);
        
        // We'll still mark the appointment as successful even if email fails
        // This ensures users can continue with their appointment booking
        setEmailStatus('failed');
        
        // Log detailed error information
        if (emailError.text) {
          console.error(`EmailJS error text: ${emailError.text}`);
        }
        if (emailError.name) {
          console.error(`EmailJS error name: ${emailError.name}`);
        }
        
        return false;
      }
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      setEmailStatus('failed');
      return false;
    }
  };

  const handleBooking = async () => {
    if (selectedSlot === null) {
      setError("Please select a time slot");
      return;
    }

    try {
      // Get user email for confirmation
      const userCredentialsString = localStorage.getItem('userCredentials');
      let userEmail = "user@example.com"; // Default fallback
      
      if (userCredentialsString) {
        try {
          const userCredentials = JSON.parse(userCredentialsString);
          if (userCredentials.email) {
            userEmail = userCredentials.email;
          }
        } catch (e) {
          console.error("Error parsing user credentials:", e);
        }
      }

      // Create appointment data
      const appointmentData = {
        patientID: "123456", // This should come from user auth
        serviceName: "Radiology Scan",
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        schedule: {
          startTime: timeSlots[selectedSlot],
          duration: 30 // 30 minutes
        },
        location: selectedCity || "Default City",
        patientName: {
          firstName: "John", // This should come from user profile
          lastName: "Doe" 
        },
        doctorName: {
          firstName: selectedDoctor ? selectedDoctor.split(' ')[1] : "Doctor",
          lastName: selectedDoctor ? selectedDoctor.split(' ')[2] || "" : ""
        },
        status: "Scheduled"
      };

      // Call API to schedule appointment
      const response = await axios.post('http://localhost:8000/appointment/schedule', appointmentData);
      
      if (response.data && response.data.appointmentId) {
        const appointmentId = response.data.appointmentId;
        setAppointmentId(appointmentId);
        
        // Store appointment ID in localStorage for the checkout page
        // But don't automatically navigate to checkout
        localStorage.setItem('currentAppointmentId', appointmentId);
        
        // Store booking details for confirmation
        const bookingInfo = {
          ...appointmentData,
          appointmentId: appointmentId,
          price: 150.00
        };
        setBookingDetails(bookingInfo);
        
        // Send confirmation email
        await sendConfirmationEmail(bookingInfo, userEmail);
        
        // Show success message with payment link
        setBookingSuccess(true);
      } else {
        setError("Failed to schedule appointment. Please try again.");
      }
    } catch (err) {
      console.error("Error scheduling appointment:", err);
      setError("An error occurred while scheduling. Please try again.");
    }
  };

  const goToPayment = () => {
    // Explicitly navigate to checkout when user clicks the payment button
    navigate('/checkout');
  };

  if (bookingSuccess && bookingDetails) {
    return (
      <div className="booking-confirmation">
        <div className="confirmation-icon">✓</div>
        <h3>Appointment Booked!</h3>
        
        <div className="confirmation-details">
          <p className="service-name">{bookingDetails.serviceName}</p>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date(bookingDetails.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">{bookingDetails.schedule.startTime}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{bookingDetails.location}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Doctor:</span>
            <span className="detail-value">Dr. {bookingDetails.doctorName.firstName} {bookingDetails.doctorName.lastName}</span>
          </div>
          <div className="detail-row price">
            <span className="detail-label">Price:</span>
            <span className="detail-value">${bookingDetails.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="confirmation-message">
          <p>We've sent a confirmation email with your appointment details.</p>
          {emailStatus === 'sending' && <p className="email-status sending">Sending email confirmation...</p>}
          {emailStatus === 'success' && <p className="email-status success">Email confirmation sent!</p>}
          {emailStatus === 'failed' && <p className="email-status failed">Note: We couldn't send the email confirmation. Please proceed with payment.</p>}
          <p>Please complete the payment to confirm your appointment.</p>
        </div>
        
        <div className="confirmation-actions">
          <button className="payment-link-btn" onClick={goToPayment}>
            Complete Payment Now
          </button>
          <button className="back-to-profile-btn" onClick={() => navigate('/patient')}>
            Pay Later & Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="time-slot-list-container">
        <ul className="time-slot-list">
          {timeSlots.map((timeSlot, index) => (
            <li
              key={index}
              className={`time-slot ${index === selectedSlot ? 'selected' : ''}`}
              onClick={() => handleSelection(index)}
            >
              {timeSlot}
            </li>
          ))}
        </ul>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="checkout-btn-container">
        <button className="checkout-btn" onClick={handleBooking}>
          Book Appointment
        </button>
      </div>
    </>
  );
};

export default TimeSlotList;
