import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backg from "../../../images/hero.jpeg"
import "./checkout.css"
import PaymentDialog from '../PaymentDialog/paymentDialog'
import Navbar from '../../Home/NavBar/Navbar'
import axios from 'axios';

// Define appointment data interface
interface AppointmentData {
  id: string;
  serviceName: string;
  date: string;
  location: string;
  doctorName: string;
  time: string;
  price: number;
}

function Checkout() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [missingAppointment, setMissingAppointment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checkout component mounted");
    
    // Get appointment ID from localStorage
    const appointmentId = localStorage.getItem('currentAppointmentId');
    console.log("Appointment ID from localStorage:", appointmentId);
    
    if (!appointmentId) {
      // Don't immediately redirect, just show a message instead
      console.log("No appointment ID found");
      setMissingAppointment(true);
      setLoading(false);
      return;
    }

    // In a real application, fetch appointment details from the server
    const fetchAppointmentDetails = async () => {
      try {
        // Attempt to fetch from API
        try {
          const response = await axios.get(`http://localhost:8000/appointment/${appointmentId}`);
          console.log("Appointment data from API:", response.data);
          setAppointmentData(response.data);
        } catch (apiError) {
          console.error('API error, using mock data:', apiError);
          
          // For demo purposes, use mock data if API fails
          const mockData: AppointmentData = {
            id: appointmentId,
            serviceName: 'Radiology Scan',
            date: new Date().toISOString().split('T')[0],
            location: 'New York',
            doctorName: 'Dr. Smith',
            time: '10:00 AM',
            price: 150.00
          };
          console.log("Using mock appointment data:", mockData);
          setAppointmentData(mockData);
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, []);

  const handleBackToProfile = () => {
    navigate('/patient');
  };

  const handleGoToScheduling = () => {
    navigate('/schedule-appointment');
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        {missingAppointment ? (
          <div className="missing-appointment">
            <div className="missing-icon">!</div>
            <h2>No Appointment Selected</h2>
            <p>You haven't selected an appointment to pay for.</p>
            <div className="missing-actions">
              <button className="schedule-button" onClick={handleGoToScheduling}>
                Schedule an Appointment
              </button>
              <button className="back-to-profile-button" onClick={handleBackToProfile}>
                Return to Profile
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="checkout-container">
              <div className="overlay"></div>
              <img src={backg} alt="Background" className="background-image" />
              <div className="checkout-content">
                <h1>Complete Your Booking</h1>
                {loading ? (
                  <div className="loading-spinner">Loading appointment details...</div>
                ) : appointmentData ? (
                  <div className="appointment-summary">
                    <h2>Appointment Details</h2>
                    <p className="service-name">{appointmentData.serviceName}</p>
                    <div className="details-row">
                      <span><strong>Date:</strong> {new Date(appointmentData.date).toLocaleDateString()}</span>
                      <span><strong>Time:</strong> {appointmentData.time}</span>
                    </div>
                    <div className="details-row">
                      <span><strong>Location:</strong> {appointmentData.location}</span>
                      <span><strong>Doctor:</strong> {appointmentData.doctorName}</span>
                    </div>
                    <p className="price-tag">Total: ${appointmentData.price.toFixed(2)}</p>
                    <p className="payment-notice">
                      Your appointment has been reserved. Please complete the payment to confirm your booking.
                    </p>
                  </div>
                ) : (
                  <div className="error-message">Failed to load appointment details.</div>
                )}
                <button className="back-button" onClick={handleBackToProfile}>
                  Cancel and Return to Profile
                </button>
              </div>
            </div>
            <PaymentDialog />
          </>
        )}
      </div>
    </>
  )
}

export default Checkout