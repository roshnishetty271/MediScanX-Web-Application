// PatientUI.tsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { selectUserData, setUserData } from "../../../app/store";
import "./PatientUI.css";
import radioXImage from "../../../images/Mediscanx-logo.png";
import { useNavigate } from 'react-router-dom';
import AppointmentScheduler from "../../../components/Appointment/AppointmentScheduler/AppointmentScheduler";

const PatientUI: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get location for state
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [activeButton, setActiveButton] = useState("profileDetails");
  const [updatedUserData, setUpdatedUserData] = useState({ ...userData });

  useEffect(() => {
    // Check if user is logged in as a patient
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (!username || (userRole && userRole !== 'patient')) {
      // Redirect to login if not logged in or logged in as non-patient
      navigate('/login');
      return;
    }
    
    // Load user data from localStorage if Redux state is empty
    if (!userData || !userData.name || userData.name === '') {
      try {
        // Try to load user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          console.log('Loaded user data from localStorage:', parsedUserData);
          
          // Update Redux store
          dispatch(setUserData(parsedUserData));
          
          // Update local state
          setUpdatedUserData(parsedUserData);
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      }
    }
  }, [userData, dispatch, navigate]);

  // Check if we should open the appointment scheduler based on navigation state
  useEffect(() => {
    if (location.state && location.state.openAppointment) {
      setActiveButton("scheduleAppointment");
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleButtonClick = (buttonName: string) => {
    if (buttonName === "Logout") {
      // If Logout button is clicked, clear user data and navigate to the login page
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      navigate('/login');
    } else if (buttonName === "cancelAppointment") {
      // Navigate to the my appointments page where user can view and cancel appointments
      navigate('/my-appointments');
    } else {
      setActiveButton(buttonName);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProfile = () => {
    dispatch(setUserData(updatedUserData));
    setActiveButton("profileDetails");
  };

  const renderContent = () => {
    if (activeButton === "scheduleAppointment") {
      return (
        <div className="profile-box appointment-container">
          <AppointmentScheduler />
        </div>
      );
    } else if (activeButton === "updateProfile") {
      return (
        <div className="profile-box">
          <h2>Update Profile</h2>
          <form className="update-profile-form">
            <div className="form-column">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={updatedUserData.name}
                onChange={handleInputChange}
              />
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                value={updatedUserData.dateOfBirth}
                onChange={handleInputChange}
              />
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={updatedUserData.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-column">
              <label htmlFor="address">Address:</label>
              <input
                id="address"
                type="text"
                name="address"
                value={updatedUserData.address}
                onChange={handleInputChange}
              />
              <label htmlFor="gender">Gender:</label>
              <select id="gender" name="gender" >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              
              <label htmlFor="symptoms">Symptoms:</label>
              <input
                id="symptoms"
                type="text"
                name="symptoms"
                value={updatedUserData.symptoms}
                onChange={handleInputChange}
              />
            </div>
            <button type="button" onClick={handleUpdateProfile}>
              Update
            </button>
          </form>
        </div>
      );
    } else if (activeButton === "viewMedicalReport") {
      return (
        <div className="profile-box">
          <h2>Medical Reports</h2>
          <p>No medical reports available yet.</p>
        </div>
      );
    } else {
      // Profile Details (default view)
      return (
        <div className="profile-box">
          <h2>Profile Details</h2>
          <div className="profile-column">
            <div>
              <p>
                <span>Name:</span> {userData.name}
              </p>
              <div className="profile-section-divider"> </div>
              <p>
                <span>Date of Birth:</span> {userData.dateOfBirth}
              </p>
              <div className="profile-section-divider"> </div>
              <p>
                <span>Phone Number:</span> {userData.phoneNumber}
              </p>
            </div>
            <div>
              <div className="profile-section-divider"> </div>
              <p>
                <span>Address:</span> {userData.address}
              </p>
              <div className="profile-section-divider"> </div>
              <p>
                <span>Gender:</span> {userData.gender}
              </p>
              <div className="profile-section-divider"> </div>
              <p>
                <span>Symptoms:</span> {userData.symptoms}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="patient-container">
      <div className="sidebar">
        <div className="sidebar-header">
          {/* Your header content */}
        </div>
        <Link to="/">
          <img src={radioXImage} alt="RadioX Logo" className="logo-image" />
        </Link>
        <button
          className={`sidebar-content ${activeButton === "scheduleAppointment" ? "active" : ""}`}
          onClick={() => handleButtonClick("scheduleAppointment")}
        >
          Schedule an appointment
        </button>
        <button
          className={`sidebar-content ${activeButton === "cancelAppointment" ? "active" : ""}`}
          onClick={() => handleButtonClick("cancelAppointment")}
        >
          Cancel an appointment
        </button>
        <button
          className={`sidebar-content ${activeButton === "updateProfile" ? "active" : ""}`}
          onClick={() => handleButtonClick("updateProfile")}
        >
          Update Profile
        </button>
        <button
          className={`sidebar-content ${activeButton === "profileDetails" ? "active" : ""}`}
          onClick={() => handleButtonClick("profileDetails")}
        >
          View Profile
        </button>
        <button
          className={`sidebar-content ${activeButton === "viewMedicalReport" ? "active" : ""}`}
          onClick={() => handleButtonClick("viewMedicalReport")}
        >
          View Medical Report
        </button>
        <button
          className={`sidebar-content ${activeButton === "Logout" ? "active" : ""}`}
          onClick={() => handleButtonClick("Logout")}
        >
          Logout
        </button>
      </div>
      <div className="patient-ui">
        <h1>Welcome to MediScanX Patient Portal</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default PatientUI;

