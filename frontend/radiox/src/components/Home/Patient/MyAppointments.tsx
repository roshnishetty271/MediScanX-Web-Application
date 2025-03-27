import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppointmentCard from './AppointmentCard';
import './MyAppointments.css';

interface Appointment {
  _id: string;
  patientName: {
    firstName: string;
    lastName: string;
  };
  doctorName: {
    firstName: string;
    lastName: string;
  };
  date: string;
  schedule: {
    startTime: string;
    duration: number;
  };
  location: string;
  serviceName: string;
  status: string;
  patientID: string;
}

const MyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'scheduled' | 'cancelled'>('all');
  const navigate = useNavigate();
  
  // This would come from authentication in a real app
  const patientId = "123456"; 

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // We'll try multiple endpoints to get appointment data
      console.log("Fetching appointments from API...");
      let appointmentsData = null;
      
      // First try the direct MongoDB data endpoint
      try {
        console.log("Trying raw MongoDB data endpoint");
        const rawResponse = await axios.get('http://localhost:8000/appointment/raw');
        console.log("Raw MongoDB response:", rawResponse.data);
        
        if (Array.isArray(rawResponse.data) && rawResponse.data.length > 0) {
          appointmentsData = rawResponse.data;
          console.log("Successfully retrieved raw appointments from MongoDB:", appointmentsData);
        } else {
          console.log("No appointments returned from raw endpoint");
        }
      } catch (rawErr) {
        console.log("Raw endpoint error:", rawErr);
      }
      
      // If raw endpoint fails, try the general endpoint
      if (!appointmentsData) {
        try {
          console.log("Trying general appointments endpoint");
          const generalResponse = await axios.get('http://localhost:8000/appointment');
          console.log("General endpoint response:", generalResponse.data);
          
          if (Array.isArray(generalResponse.data) && generalResponse.data.length > 0) {
            appointmentsData = generalResponse.data;
            console.log("Successfully retrieved all appointments from database:", appointmentsData);
            
            // Inspect data structure to ensure it matches what we expect
            appointmentsData.forEach((appointment, index) => {
              console.log(`Appointment ${index + 1}:`, {
                id: appointment._id,
                patientID: appointment.patientID,
                serviceName: appointment.serviceName,
                status: appointment.status,
                schedule: appointment.schedule,
                doctorName: appointment.doctorName,
                patientName: appointment.patientName
              });
            });
          } else {
            console.log("No appointments returned from general endpoint");
          }
        } catch (err) {
          console.log("General endpoint error:", err);
        }
      }
      
      // If we have appointment data, use it
      if (appointmentsData && appointmentsData.length > 0) {
        // Ensure the data has the required structure before setting it
        const processedAppointments = appointmentsData.map(appointment => {
          // Create default structure if any required fields are missing
          return {
            _id: appointment._id || `temp-${Date.now()}`,
            patientName: appointment.patientName || {
              firstName: "Unknown",
              lastName: "Patient"
            },
            doctorName: appointment.doctorName || {
              firstName: "Unknown",
              lastName: "Doctor"
            },
            date: appointment.date || new Date().toISOString(),
            schedule: appointment.schedule || {
              startTime: "Unknown",
              duration: 30
            },
            location: appointment.location || "Unknown",
            serviceName: appointment.serviceName || "Unknown Service",
            status: appointment.status || "Scheduled",
            patientID: appointment.patientID || "unknown"
          };
        });
        
        console.log("Processed appointments for display:", processedAppointments);
        setAppointments(processedAppointments);
      } else {
        // If all API attempts fail, use mock data
        console.log("All API endpoints failed, using mock data");
        const mockAppointments = [
          {
            _id: "1",
            patientName: {
              firstName: "John",
              lastName: "Doe"
            },
            doctorName: {
              firstName: "Jane",
              lastName: "Smith"
            },
            date: new Date().toISOString(),
            schedule: {
              startTime: "10:00 AM",
              duration: 30
            },
            location: "New York",
            serviceName: "X-Ray Scan",
            status: "Scheduled",
            patientID: "123456"
          },
          {
            _id: "2",
            patientName: {
              firstName: "John",
              lastName: "Doe"
            },
            doctorName: {
              firstName: "Michael",
              lastName: "Johnson"
            },
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            schedule: {
              startTime: "11:30 AM",
              duration: 45
            },
            location: "Boston",
            serviceName: "MRI Scan",
            status: "Scheduled",
            patientID: "123456"
          }
        ];
        setAppointments(mockAppointments);
        setError('Using example appointments. Could not connect to database. Please try again later.');
      }
    } catch (err) {
      console.error('Error in appointment fetching process:', err);
      setError('Failed to load appointments from database. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Check if user is logged in as a patient
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (!username || (userRole && userRole !== 'patient')) {
      // Redirect to login if not logged in or logged in as non-patient
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleCancelSuccess = () => {
    // Refresh the appointments list after successful cancellation
    fetchAppointments();
  };

  const handleBackToProfile = () => {
    try {
      // Try to load user data from localStorage before navigating
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        console.log("Navigating back to profile with user data from localStorage");
      }
      navigate('/patient');
    } catch (error) {
      console.error("Error during navigation:", error);
      // Navigate anyway
      navigate('/patient');
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    // Normalize the status to handle both lowercase and uppercase values
    const status = appointment.status.toLowerCase();
    
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'scheduled') return status === 'scheduled';
    if (selectedFilter === 'cancelled') return status === 'cancelled';
    return true;
  });

  return (
    <>
      <Container maxWidth="lg" className="appointments-container">
        <Grid container spacing={3}>
          {/* Left sidebar */}
          <Grid item xs={12} md={3}>
            <Paper className="sidebar-paper" elevation={3}>
              <Typography variant="h5" component="h2" gutterBottom className="sidebar-title">
                Appointment Manager
              </Typography>
              
              <div className="filter-buttons">
                <Button 
                  variant={selectedFilter === 'all' ? 'contained' : 'outlined'}
                  color="primary"
                  fullWidth
                  onClick={() => setSelectedFilter('all')}
                  className="filter-button"
                >
                  All Appointments
                </Button>
                <Button 
                  variant={selectedFilter === 'scheduled' ? 'contained' : 'outlined'}
                  color="success"
                  fullWidth
                  onClick={() => setSelectedFilter('scheduled')}
                  className="filter-button"
                >
                  Scheduled
                </Button>
                <Button 
                  variant={selectedFilter === 'cancelled' ? 'contained' : 'outlined'}
                  color="error"
                  fullWidth
                  onClick={() => setSelectedFilter('cancelled')}
                  className="filter-button"
                >
                  Cancelled
                </Button>
              </div>
              
              <div className="action-buttons">
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  onClick={() => navigate('/patient', { state: { openAppointment: true } })}
                  className="schedule-button"
                >
                  Schedule New Appointment
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  onClick={handleBackToProfile}
                  className="profile-button"
                >
                  Back to Profile
                </Button>
              </div>
            </Paper>
          </Grid>
          
          {/* Right content area */}
          <Grid item xs={12} md={9}>
            <Paper className="content-paper" elevation={3}>
              <Typography variant="h4" component="h1" gutterBottom className="page-title">
                My Appointments
              </Typography>
              
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" my={4}>
                  <CircularProgress size={60} />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading your appointments...
                  </Typography>
                </Box>
              ) : error ? (
                <>
                  <Alert severity="warning" sx={{ mt: 2, mb: 3 }}>
                    {error}
                  </Alert>
                  {filteredAppointments.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom>
                        Demo Appointments
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Showing sample appointment data for demonstration purposes.
                      </Typography>
                    </Box>
                  )}
                  {filteredAppointments.length > 0 && (
                    <div className="appointments-grid">
                      {filteredAppointments.map((appointment) => (
                        <AppointmentCard 
                          key={appointment._id} 
                          appointment={appointment} 
                          onCancelSuccess={handleCancelSuccess}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : filteredAppointments.length === 0 ? (
                <Alert severity="info" className="no-appointments">
                  {selectedFilter === 'all' 
                    ? "You don't have any appointments." 
                    : selectedFilter === 'scheduled' 
                      ? "You don't have any scheduled appointments." 
                      : "You don't have any cancelled appointments."}
                </Alert>
              ) : (
                <div className="appointments-grid">
                  {filteredAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment._id} 
                      appointment={appointment} 
                      onCancelSuccess={handleCancelSuccess}
                    />
                  ))}
                </div>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default MyAppointments; 