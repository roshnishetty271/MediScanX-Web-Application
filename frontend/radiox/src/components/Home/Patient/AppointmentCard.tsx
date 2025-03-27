import React, { useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Box,
  Chip,
  Divider,
  Avatar,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AppointmentCard.css';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';

interface AppointmentCardProps {
  appointment: {
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
  };
  onCancelSuccess?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancelSuccess }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isCancelling, setIsCancelling] = useState(false);

  // Format date for better display
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color based on appointment status
  const getStatusColor = () => {
    // Normalize status to handle both lowercase and uppercase variations
    const status = appointment.status.toLowerCase();
    
    switch (status) {
      case 'scheduled':
        return {
          bgcolor: '#e3f7ea',
          color: '#2e7d32',
          label: 'Scheduled'
        };
      case 'cancelled':
        return {
          bgcolor: '#ffebee',
          color: '#c62828',
          label: 'Cancelled'
        };
      case 'completed':
        return {
          bgcolor: '#e8eaf6',
          color: '#3f51b5',
          label: 'Completed'
        };
      default:
        return {
          bgcolor: '#f5f5f5',
          color: '#757575',
          label: appointment.status
        };
    }
  };

  const statusStyle = getStatusColor();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    
    try {
      // Call API to cancel appointment
      console.log(`Cancelling appointment with ID: ${appointment._id}`);
      const response = await axios.patch(`http://localhost:8000/appointment/cancel/${appointment._id}`, {
        status: 'Cancelled'
      });
      
      console.log('Cancel response:', response.data);
      setSnackbarMessage('Appointment cancelled successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Close dialog
      setOpen(false);
      
      // Notify parent component
      if (onCancelSuccess) {
        onCancelSuccess();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setSnackbarMessage('Failed to cancel appointment. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle navigating back to profile to ensure user data is preserved
  const handleBackToProfile = () => {
    try {
      // Simply navigate back to the profile page
      // PatientUI component will handle loading data from localStorage if needed
      navigate('/patient');
    } catch (error) {
      console.error('Error navigating back to profile:', error);
    }
  };

  return (
    <>
      <Card className={`appointment-card ${appointment.status.toLowerCase()}`}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h5" component="div" className="service-name">
                {appointment.serviceName}
              </Typography>
              <Typography className="doctor-name">
                Dr. {appointment.doctorName.firstName} {appointment.doctorName.lastName}
              </Typography>
            </Box>
            <Chip 
              label={statusStyle.label}
              sx={{ 
                bgcolor: statusStyle.bgcolor, 
                color: statusStyle.color,
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            />
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" className="detail-row">
                <EventIcon className="detail-icon" />
                <Typography variant="body2" className="detail-text">
                  {formatAppointmentDate(appointment.date)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" className="detail-row">
                <AccessTimeIcon className="detail-icon" />
                <Typography variant="body2" className="detail-text">
                  {appointment.schedule.startTime} ({appointment.schedule.duration} mins)
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" className="detail-row">
                <LocationOnIcon className="detail-icon" />
                <Typography variant="body2" className="detail-text">
                  {appointment.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" className="detail-row">
                <PersonIcon className="detail-icon" />
                <Typography variant="body2" className="detail-text">
                  {appointment.patientName.firstName} {appointment.patientName.lastName}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {appointment.status === 'Scheduled' && (
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleClickOpen}
                className="cancel-button"
              >
                Cancel Appointment
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className="cancel-dialog"
      >
        <DialogTitle className="dialog-title">
          Cancel Appointment
        </DialogTitle>
        <DialogContent>
          <Box className="dialog-content-container">
            <Box className="dialog-warning-icon">
              <Typography variant="h2" color="error">!</Typography>
            </Box>
            <DialogContentText className="dialog-message">
              Are you sure you want to cancel your appointment for {appointment.serviceName} on {formatAppointmentDate(appointment.date)} at {appointment.schedule.startTime}?
            </DialogContentText>
            <Box className="appointment-summary-box">
              <Typography variant="subtitle1" className="summary-title">
                Appointment Details:
              </Typography>
              <Box className="summary-details">
                <Typography variant="body2">
                  <strong>Service:</strong> {appointment.serviceName}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatAppointmentDate(appointment.date)}
                </Typography>
                <Typography variant="body2">
                  <strong>Time:</strong> {appointment.schedule.startTime}
                </Typography>
                <Typography variant="body2">
                  <strong>Doctor:</strong> Dr. {appointment.doctorName.firstName} {appointment.doctorName.lastName}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {appointment.location}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="error" className="cancellation-notice">
              Note: Cancellations within 24 hours of the appointment time may incur a fee.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button 
            onClick={handleClose} 
            variant="outlined"
            disabled={isCancelling}
          >
            No, Keep Appointment
          </Button>
          <Button 
            onClick={handleCancelAppointment} 
            color="error" 
            variant="contained"
            disabled={isCancelling}
            autoFocus
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel Appointment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppointmentCard; 