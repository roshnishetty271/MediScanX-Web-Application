import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid, Button, Card, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ImageIcon from '@mui/icons-material/Image';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

// Import the DicomViewer component
// @ts-ignore
const DicomViewer = require('../components/DicomViewer/DicomViewer').default;

// Add interface for medical report
interface MedicalReport {
  id: string;
  patientId: string;
  reportType: string;
  fileName: string;
  dateUploaded: string;
  fileContent: string;
  viewed: boolean;
}

// Add interfaces for other data types
interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dateTime: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [doctorName, setDoctorName] = useState<string>('Dr. Smith');
  
  // Section visibility states
  const [showReports, setShowReports] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);
  const [showPatients, setShowPatients] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  
  // Data states
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Dialog states
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'standard' | 'dicom'>('standard');
  
  // Add animation for completion rate spinner
  useEffect(() => {
    // Create stylesheet for the animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  useEffect(() => {
    // Check if user is logged in as a doctor
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    const storedDoctorName = localStorage.getItem('doctorName');
    
    if (userRole !== 'doctor' || !username) {
      // Redirect to login if not logged in as doctor
      navigate('/login');
      return;
    }
    
    setDoctorName(storedDoctorName || 'Dr. John Doe');
    
    // Load medical reports from localStorage
    const storedReports = localStorage.getItem('medicalReports');
    if (storedReports) {
      setMedicalReports(JSON.parse(storedReports));
    } else {
      // Initialize with sample data if none exists
      const sampleReports = getSampleReports();
      setMedicalReports(sampleReports);
      localStorage.setItem('medicalReports', JSON.stringify(sampleReports));
    }
    
    // Load sample data for other sections
    setPatients(getSamplePatients());
    setAppointments(getSampleAppointments());
  }, [navigate]);
  
  // Sample data generators
  const getSampleReports = (): MedicalReport[] => {
    return [
      {
        id: '1',
        patientId: 'P-1001',
        reportType: 'Chest X-Ray',
        fileName: 'chest_xray_p1001.dcm',
        dateUploaded: new Date(2023, 4, 15).toISOString(),
        fileContent: 'https://www.researchgate.net/profile/Saad-Dahmani/publication/329771772/figure/fig4/AS:705181092638720@1545148701308/Chest-X-ray-image-from-the-JSRT-database-used-for-our-segmentation-application.jpg',
        viewed: false
      },
      {
        id: '2',
        patientId: 'P-1002',
        reportType: 'Brain MRI',
        fileName: 'brain_mri_p1002.dcm',
        dateUploaded: new Date(2023, 4, 10).toISOString(),
        fileContent: 'https://prod-images-static.radiopaedia.org/images/53248788/e92f97661eca64d66355ab72e9b5cb_big_gallery.jpeg',
        viewed: true
      },
      {
        id: '3',
        patientId: 'P-1003',
        reportType: 'Abdominal CT Scan',
        fileName: 'abdominal_ct_p1003.dcm',
        dateUploaded: new Date(2023, 4, 5).toISOString(),
        fileContent: 'https://prod-images-static.radiopaedia.org/images/154989/332aa0c67cb2e035e372c7cb9798a5_big_gallery.jpg',
        viewed: false
      }
    ];
  };
  
  const getSamplePatients = (): Patient[] => {
    return [
      { id: 'P-1001', name: 'James Wilson', age: 45, gender: 'Male', lastVisit: '2023-05-10', condition: 'Hypertension' },
      { id: 'P-1002', name: 'Maria Garcia', age: 35, gender: 'Female', lastVisit: '2023-05-12', condition: 'Migraines' },
      { id: 'P-1003', name: 'Robert Chen', age: 60, gender: 'Male', lastVisit: '2023-05-05', condition: 'Arthritis' },
      { id: 'P-1004', name: 'Sarah Johnson', age: 28, gender: 'Female', lastVisit: '2023-05-15', condition: 'Asthma' },
      { id: 'P-1005', name: 'David Kim', age: 50, gender: 'Male', lastVisit: '2023-05-03', condition: 'Diabetes' },
    ];
  };
  
  const getSampleAppointments = (): Appointment[] => {
    const today = new Date();
    return [
      { id: 'A-1001', patientId: 'P-1001', patientName: 'James Wilson', dateTime: new Date(today.setHours(9, 0)).toISOString(), reason: 'Follow-up', status: 'scheduled' },
      { id: 'A-1002', patientId: 'P-1002', patientName: 'Maria Garcia', dateTime: new Date(today.setHours(10, 30)).toISOString(), reason: 'Consultation', status: 'scheduled' },
      { id: 'A-1003', patientId: 'P-1003', patientName: 'Robert Chen', dateTime: new Date(today.setHours(13, 0)).toISOString(), reason: 'X-Ray Review', status: 'scheduled' },
      { id: 'A-1004', patientId: 'P-1004', patientName: 'Sarah Johnson', dateTime: new Date(today.setHours(14, 30)).toISOString(), reason: 'Prescription Renewal', status: 'scheduled' },
      { id: 'A-1005', patientId: 'P-1005', patientName: 'David Kim', dateTime: new Date(today.setHours(16, 0)).toISOString(), reason: 'Test Results', status: 'scheduled' },
      { id: 'A-1006', patientId: 'P-1006', patientName: 'Emma Thompson', dateTime: new Date(today.setHours(17, 0)).toISOString(), reason: 'New Patient', status: 'scheduled' },
      { id: 'A-1007', patientId: 'P-1007', patientName: 'Michael Brown', dateTime: new Date(today.setHours(11, 0)).toISOString(), reason: 'MRI Review', status: 'scheduled' },
      { id: 'A-1008', patientId: 'P-1008', patientName: 'Jessica Lee', dateTime: new Date(today.setHours(15, 30)).toISOString(), reason: 'Annual Checkup', status: 'scheduled' },
    ];
  };
  
  // Section visibility handlers
  const resetAllSections = () => {
    setShowReports(false);
    setShowSchedule(false);
    setShowPatients(false);
    setShowAnalytics(false);
  };
  
  const handleViewReports = () => {
    resetAllSections();
    setShowReports(true);
  };
  
  const handleViewSchedule = () => {
    resetAllSections();
    setShowSchedule(true);
  };
  
  const handleManagePatients = () => {
    resetAllSections();
    setShowPatients(true);
  };
  
  const handleViewAnalytics = () => {
    resetAllSections();
    setShowAnalytics(true);
  };
  
  const handleBackToDashboard = () => {
    resetAllSections();
  };
  
  // Logout handler
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('doctorName');
    navigate('/login');
  };
  
  // Report handlers
  const handleViewReport = (report: MedicalReport) => {
    // Mark report as viewed
    if (!report.viewed) {
      const updatedReports = medicalReports.map(r => 
        r.id === report.id ? { ...r, viewed: true } : r
      );
      setMedicalReports(updatedReports);
      localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
    }
    
    // Open report dialog
    setSelectedReport(report);
    
    // Determine initial view mode based on file type
    if (report.fileName.toLowerCase().endsWith('.dcm') || 
        report.reportType.toLowerCase().includes('x-ray') ||
        report.reportType.toLowerCase().includes('mri') ||
        report.reportType.toLowerCase().includes('ct scan')) {
      setViewMode('dicom');
    } else {
      setViewMode('standard');
    }
    
    setReportDialogOpen(true);
  };
  
  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
    setSelectedReport(null);
  };
  
  const handleViewModeChange = (event: React.SyntheticEvent, newMode: 'standard' | 'dicom') => {
    setViewMode(newMode);
  };
  
  // Count unread reports
  const unreadReportsCount = medicalReports.filter(report => !report.viewed).length;
  
  // Render dashboard content or reports based on state
  const renderContent = () => {
    // Reports section
    if (showReports) {
      return (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" fontWeight="bold" color="#2c3e50">
              Medical Reports
            </Typography>
            <Button 
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{ borderColor: '#3498db', color: '#3498db' }}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          {medicalReports.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No medical reports available
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                Reports uploaded by administrators will appear here
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {medicalReports.slice().reverse().map((report) => (
                <Grid item xs={12} sm={6} md={4} key={report.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      position: 'relative',
                      borderLeft: '4px solid',
                      borderLeftColor: report.viewed ? '#2ecc71' : '#f39c12',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 3
                      }
                    }}
                  >
                    {!report.viewed && (
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: 10, 
                          right: 10,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: '#f39c12'
                        }}
                      />
                    )}
                    
                    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                      {report.reportType}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Patient ID: {report.patientId}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      File: {report.fileName}
                    </Typography>
                    
                    <Typography variant="caption" display="block" color="text.secondary" mb={2}>
                      Uploaded: {new Date(report.dateUploaded).toLocaleString()}
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={() => handleViewReport(report)}
                      sx={{ 
                        mt: 'auto',
                        bgcolor: '#3498db',
                        '&:hover': { bgcolor: '#2980b9' }
                      }}
                    >
                      View Report
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      );
    }
    
    // Schedule section
    if (showSchedule) {
      return (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" fontWeight="bold" color="#2c3e50">
              Today's Schedule
            </Typography>
            <Button 
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{ borderColor: '#3498db', color: '#3498db' }}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          {appointments.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No appointments scheduled
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                Your schedule is clear for today
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ p: 0, overflow: 'hidden' }}>
              {appointments.map((appointment, index) => (
                <Box 
                  key={appointment.id}
                  sx={{ 
                    p: 2, 
                    borderBottom: index < appointments.length - 1 ? '1px solid #e0e0e0' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { bgcolor: '#f5f7fa' }
                  }}
                >
                  <Box 
                    sx={{ 
                      minWidth: '80px',
                      textAlign: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: '#e8f4fd',
                      color: '#3498db',
                      fontWeight: 'bold'
                    }}
                  >
                    {new Date(appointment.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Box>
                  
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {appointment.patientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.reason} - Patient ID: {appointment.patientId}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1, borderColor: '#3498db', color: '#3498db' }}
                    >
                      Patient Info
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ bgcolor: '#2ecc71', '&:hover': { bgcolor: '#27ae60' } }}
                    >
                      Start Session
                    </Button>
                  </Box>
                </Box>
              ))}
            </Paper>
          )}
        </>
      );
    }
    
    // Patients section
    if (showPatients) {
      return (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" fontWeight="bold" color="#2c3e50">
              Patient Management
            </Typography>
            <Button 
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{ borderColor: '#3498db', color: '#3498db' }}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f5f7fa' }}>
              <Grid container spacing={1} sx={{ fontWeight: 'bold' }}>
                <Grid item xs={1}><Typography variant="body2">ID</Typography></Grid>
                <Grid item xs={3}><Typography variant="body2">Name</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">Age</Typography></Grid>
                <Grid item xs={1}><Typography variant="body2">Gender</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">Last Visit</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">Condition</Typography></Grid>
                <Grid item xs={2}><Typography variant="body2">Actions</Typography></Grid>
              </Grid>
            </Box>
            
            {patients.map((patient, index) => (
              <Box 
                key={patient.id}
                sx={{ 
                  p: 2, 
                  borderBottom: index < patients.length - 1 ? '1px solid #e0e0e0' : 'none',
                  '&:hover': { bgcolor: '#f9f9f9' }
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={1}><Typography variant="body2">{patient.id}</Typography></Grid>
                  <Grid item xs={3}><Typography variant="body2">{patient.name}</Typography></Grid>
                  <Grid item xs={1}><Typography variant="body2">{patient.age}</Typography></Grid>
                  <Grid item xs={1}><Typography variant="body2">{patient.gender}</Typography></Grid>
                  <Grid item xs={2}><Typography variant="body2">{patient.lastVisit}</Typography></Grid>
                  <Grid item xs={2}><Typography variant="body2">{patient.condition}</Typography></Grid>
                  <Grid item xs={2}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1, borderColor: '#3498db', color: '#3498db' }}
                    >
                      Records
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small" 
                      sx={{ bgcolor: '#9b59b6', '&:hover': { bgcolor: '#8e44ad' } }}
                    >
                      Edit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Paper>
        </>
      );
    }
    
    // Analytics section
    if (showAnalytics) {
      return (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h2" fontWeight="bold" color="#2c3e50">
              Analytics & Reports
            </Typography>
            <Button 
              variant="outlined"
              onClick={handleBackToDashboard}
              sx={{ borderColor: '#3498db', color: '#3498db' }}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          {/* Overview Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: '#f0f9ff', overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom color="#3498db">
                  Patient Visits
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="#2c3e50">324</Typography>
                <Typography variant="body2" color="text.secondary">Last 30 days</Typography>
                <Box 
                  sx={{ 
                    mt: 2, 
                    height: 4, 
                    bgcolor: '#e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ height: '100%', width: '70%', bgcolor: '#3498db' }}></Box>
                </Box>
                <Typography variant="body2" color="success.main" mt={1}>↑ 12% from previous month</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: '#f0fff5', overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom color="#2ecc71">
                  Completion Rate
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="#2c3e50">92%</Typography>
                <Typography variant="body2" color="text.secondary">Appointments completed</Typography>
                <Box sx={{ 
                  mt: 2,
                  height: 40,
                  width: 40,
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: '4px solid #e0e0e0',
                  borderTop: '4px solid #2ecc71',
                  animation: 'spin 2s linear infinite',
                }}></Box>
                <Typography variant="body2" color="success.main" mt={1}>↑ 3% from previous month</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: '#fff8f0', overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom color="#f39c12">
                  Avg. Wait Time
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="#2c3e50">14<Typography component="span" variant="h5">min</Typography></Typography>
                <Typography variant="body2" color="text.secondary">Patient waiting time</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 2,
                  px: 1
                }}>
                  <Box sx={{ height: 20, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 30, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 15, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 25, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 10, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 20, width: 2, bgcolor: '#f39c12' }}></Box>
                  <Box sx={{ height: 35, width: 2, bgcolor: '#f39c12' }}></Box>
                </Box>
                <Typography variant="body2" color="error.main" mt={1}>↑ 2 min from target</Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: '#f9f0ff', overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom color="#9b59b6">
                  New Patients
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="#2c3e50">57</Typography>
                <Typography variant="body2" color="text.secondary">This month</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  justifyContent: 'center', 
                  height: 40,
                  mt: 1
                }}>
                  {[15, 22, 18, 25, 30, 28, 35].map((val, i) => (
                    <Box 
                      key={i}
                      sx={{ 
                        height: `${val}px`, 
                        width: 5, 
                        mx: 0.5,
                        bgcolor: '#9b59b6',
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2
                      }}
                    ></Box>
                  ))}
                </Box>
                <Typography variant="body2" color="success.main" mt={1}>↑ 18% from previous month</Typography>
              </Paper>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            {/* Patient Visits Graph */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, overflow: 'hidden' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                  <Typography variant="h6" fontWeight="medium">
                    Patient Visits by Month
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    '& > div': {
                      display: 'flex',
                      alignItems: 'center',
                      mr: 2
                    }
                  }}>
                    <Box>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#3498db', mr: 1 }}></Box>
                      <Typography variant="caption">This Year</Typography>
                    </Box>
                    <Box>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#e0e0e0', mr: 1 }}></Box>
                      <Typography variant="caption">Previous Year</Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* Mock Chart */}
                <Box sx={{ 
                  height: '280px', 
                  position: 'relative',
                  mt: 3,
                  overflow: 'hidden'
                }}>
                  {/* X-axis labels */}
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    borderTop: '1px solid #e0e0e0',
                    pt: 1
                  }}>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                      <Typography key={month} variant="caption" sx={{ flex: 1, textAlign: 'center', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                        {month}
                      </Typography>
                    ))}
                  </Box>
                  
                  {/* Y-axis and grid lines */}
                  <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 20, width: 40, pr: 1 }}>
                    {[0, 25, 50, 75, 100].map((val, i) => (
                      <Box key={i} sx={{ position: 'absolute', bottom: `${i * 25}%`, right: 0, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1 }}>{val}</Typography>
                        <Box sx={{ width: '100%', borderBottom: '1px dashed #e0e0e0', position: 'absolute', left: 30, right: '-100%' }}></Box>
                      </Box>
                    ))}
                  </Box>
                  
                  {/* Data visualization - bars */}
                  <Box sx={{ position: 'absolute', top: 10, left: 50, right: 10, bottom: 30, display: 'flex', alignItems: 'flex-end', overflowX: 'hidden' }}>
                    {[65, 59, 80, 81, 56, 55, 72, 60, 76, 85, 90, 85].map((height, index) => (
                      <Box key={index} sx={{ flex: 1, mx: 0.5, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                        {/* Current year bar */}
                        <Box sx={{ 
                          width: '40%', 
                          height: `${height/100 * 100}%`, 
                          bgcolor: '#3498db',
                          borderRadius: '3px 3px 0 0',
                          mx: 'auto'
                        }}></Box>
                        
                        {/* Previous year bar */}
                        <Box sx={{ 
                          width: '40%', 
                          height: `${(height - 10 + Math.floor(Math.random() * 20))/100 * 100}%`, 
                          bgcolor: '#e0e0e0',
                          borderRadius: '3px 3px 0 0',
                          mx: 'auto'
                        }}></Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Patient Demographics */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom>
                  Patient Demographics
                </Typography>
                
                {/* Age Distribution */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Age Distribution</Typography>
                  <Box sx={{ mt: 2 }}>
                    {[
                      { label: '0-17', value: 15, color: '#3498db' },
                      { label: '18-34', value: 30, color: '#2ecc71' },
                      { label: '35-50', value: 25, color: '#f39c12' },
                      { label: '51-65', value: 20, color: '#9b59b6' },
                      { label: '65+', value: 10, color: '#e74c3c' }
                    ].map((item) => (
                      <Box key={item.label} sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">{item.label}</Typography>
                          <Typography variant="body2" fontWeight="medium">{item.value}%</Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 8, bgcolor: '#f5f5f5', borderRadius: 4, overflow: 'hidden' }}>
                          <Box sx={{ width: `${item.value}%`, height: '100%', bgcolor: item.color }}></Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                {/* Gender Distribution */}
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: { xs: 60, sm: 80 }, 
                      height: { xs: 60, sm: 80 }, 
                      borderRadius: '50%', 
                      border: '8px solid #3498db',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <Typography variant="h6" fontWeight="bold">52%</Typography>
                    </Box>
                    <Typography variant="body2" mt={1}>Female</Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: { xs: 60, sm: 80 }, 
                      height: { xs: 60, sm: 80 }, 
                      borderRadius: '50%', 
                      border: '8px solid #e74c3c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <Typography variant="h6" fontWeight="bold">48%</Typography>
                    </Box>
                    <Typography variant="body2" mt={1}>Male</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Top Diagnoses */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom>
                  Top Diagnoses
                </Typography>
                
                <Box sx={{ mt: 2, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '100%' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <th style={{ textAlign: 'left', padding: '8px 0', color: '#7f8c8d', fontWeight: 'normal' }}>Condition</th>
                        <th style={{ textAlign: 'center', padding: '8px 0', color: '#7f8c8d', fontWeight: 'normal' }}>Patients</th>
                        <th style={{ textAlign: 'right', padding: '8px 0', color: '#7f8c8d', fontWeight: 'normal' }}>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { condition: 'Hypertension', count: 42, percentage: '21%' },
                        { condition: 'Type 2 Diabetes', count: 38, percentage: '19%' },
                        { condition: 'Lower Back Pain', count: 31, percentage: '15.5%' },
                        { condition: 'Arthritis', count: 25, percentage: '12.5%' },
                        { condition: 'Anxiety Disorder', count: 22, percentage: '11%' },
                        { condition: 'Asthma', count: 18, percentage: '9%' },
                        { condition: 'GERD', count: 14, percentage: '7%' },
                        { condition: 'Migraine', count: 10, percentage: '5%' }
                      ].map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '10px 0', fontSize: '0.9rem' }}>{item.condition}</td>
                          <td style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.9rem' }}>{item.count}</td>
                          <td style={{ textAlign: 'right', padding: '10px 0', fontSize: '0.9rem', fontWeight: 'medium' }}>
                            <Box component="span" sx={{ 
                              display: 'inline-block', 
                              width: 50, 
                              height: 8, 
                              mr: 1, 
                              borderRadius: 4, 
                              bgcolor: '#e0e0e0',
                              position: 'relative',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                height: '100%', 
                                width: item.percentage.replace('%', '') + '%', 
                                bgcolor: '#3498db' 
                              }}></Box>
                            </Box>
                            {item.percentage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Grid>
            
            {/* Imaging Statistics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom>
                  Imaging Statistics
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, mt: 3, justifyContent: 'space-between' }}>
                  {[
                    { type: 'X-Ray', count: 245, color: '#3498db', icon: '🔍' },
                    { type: 'MRI', count: 120, color: '#2ecc71', icon: '🧠' },
                    { type: 'CT Scan', count: 85, color: '#f39c12', icon: '📊' },
                    { type: 'Ultrasound', count: 150, color: '#9b59b6', icon: '📡' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      width: { xs: 'calc(50% - 8px)', sm: 'calc(50% - 10px)' }, 
                      bgcolor: `${item.color}10`, 
                      borderRadius: 2, 
                      p: { xs: 1.5, sm: 2 },
                      mb: 2,
                      border: `1px solid ${item.color}30`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        width: { xs: 40, sm: 50 }, 
                        height: { xs: 40, sm: 50 }, 
                        borderRadius: '50%', 
                        bgcolor: 'white',
                        border: `2px solid ${item.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: '1.2rem', sm: '1.5rem' },
                        mb: 1
                      }}>
                        {item.icon}
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color={item.color} fontSize={{ xs: '1.3rem', sm: '1.5rem' }}>
                        {item.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.type}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Monthly Comparison
                  </Typography>
                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    borderRadius: 1,
                    overflow: 'hidden',
                    height: 20,
                    bgcolor: '#f5f5f5'
                  }}>
                    <Box sx={{ height: '100%', width: '40%', bgcolor: '#3498db' }}></Box>
                    <Box sx={{ height: '100%', width: '25%', bgcolor: '#2ecc71' }}></Box>
                    <Box sx={{ height: '100%', width: '15%', bgcolor: '#f39c12' }}></Box>
                    <Box sx={{ height: '100%', width: '20%', bgcolor: '#9b59b6' }}></Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="caption">+12% from last month</Typography>
                    <Typography variant="caption">600 total scans</Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            {/* Recent Activity */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, overflow: 'hidden' }}>
                <Typography variant="h6" gutterBottom>
                  Recent Activity
                </Typography>
                
                <Box sx={{ mt: 2, overflowX: 'auto' }}>
                  {[
                    { activity: 'New patient registered', time: '10 minutes ago', icon: '👤' },
                    { activity: 'Completed MRI scan for James Wilson', time: '32 minutes ago', icon: '📋' },
                    { activity: 'Prescription updated for Maria Garcia', time: '1 hour ago', icon: '💊' },
                    { activity: 'Consultation with Robert Chen', time: '2 hours ago', icon: '🩺' },
                    { activity: 'Lab results received for Sarah Johnson', time: '3 hours ago', icon: '🧪' }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      py: 1.5,
                      px: { xs: 0.5, sm: 1 },
                      borderBottom: index < 4 ? '1px solid #f5f5f5' : 'none',
                      flexWrap: { xs: 'wrap', sm: 'nowrap' }
                    }}>
                      <Box sx={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        bgcolor: '#f5f5f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        mr: 2,
                        flexShrink: 0
                      }}>
                        {item.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1, mb: { xs: 1, sm: 0 } }}>
                        <Typography variant="body2">{item.activity}</Typography>
                        <Typography variant="caption" color="text.secondary">{item.time}</Typography>
                      </Box>
                      <Button size="small" sx={{ color: '#3498db', flexShrink: 0 }}>View</Button>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      );
    }
    
    // Dashboard home
    return (
      <>
        <Typography variant="h4" component="h2" fontWeight="bold" color="#2c3e50" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Stats cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff', boxShadow: 2, height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Today's Appointments
                </Typography>
                <Typography variant="h4" component="div" color="#3498db" fontWeight="bold">
                  {appointments.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  3 pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff', boxShadow: 2, height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Scans Completed
                </Typography>
                <Typography variant="h4" component="div" color="#2ecc71" fontWeight="bold">
                  42
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  This week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff', boxShadow: 2, height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Scans Pending
                </Typography>
                <Typography variant="h4" component="div" color="#f39c12" fontWeight="bold">
                  {unreadReportsCount}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Needs review
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff', boxShadow: 2, height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Patients
                </Typography>
                <Typography variant="h4" component="div" color="#9b59b6" fontWeight="bold">
                  {patients.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active patients
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Typography variant="h5" component="h3" fontWeight="bold" color="#2c3e50" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<CalendarMonthIcon />}
              onClick={handleViewSchedule}
              sx={{ 
                py: 3, 
                bgcolor: '#3498db',
                '&:hover': { bgcolor: '#2980b9' }
              }}
            >
              View Schedule
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<MedicalInformationIcon />}
              onClick={handleViewReports}
              sx={{ 
                py: 3, 
                bgcolor: '#2ecc71',
                '&:hover': { bgcolor: '#27ae60' },
                position: 'relative'
              }}
            >
              Review Medical Reports
              {unreadReportsCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    bgcolor: '#e74c3c',
                    color: 'white',
                    borderRadius: '50%',
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}
                >
                  {unreadReportsCount}
                </Box>
              )}
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<PeopleIcon />}
              onClick={handleManagePatients}
              sx={{ 
                py: 3, 
                bgcolor: '#9b59b6',
                '&:hover': { bgcolor: '#8e44ad' }
              }}
            >
              Manage Patients
            </Button>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Button 
              variant="contained" 
              fullWidth 
              startIcon={<AnalyticsIcon />}
              onClick={handleViewAnalytics}
              sx={{ 
                py: 3, 
                bgcolor: '#f39c12',
                '&:hover': { bgcolor: '#e67e22' }
              }}
            >
              View Analytics
            </Button>
          </Grid>
        </Grid>
      </>
    );
  };
  
  // Render the appropriate content based on view mode
  const renderReportContent = () => {
    if (!selectedReport) return null;
    
    if (viewMode === 'dicom') {
      return (
        <Box sx={{ p: 0, height: '60vh', display: 'flex', flexDirection: 'column' }}>
          <DicomViewer
            imageUrl={selectedReport.fileContent}
            patientId={selectedReport.patientId}
            reportType={selectedReport.reportType}
          />
        </Box>
      );
    } else {
      return (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
          {selectedReport.fileContent && (
            selectedReport.fileName.toLowerCase().endsWith('.pdf') ? (
              <Typography variant="body1" color="text.secondary" textAlign="center">
                PDF preview not available. Please download the file to view.
              </Typography>
            ) : (
              <img 
                src={selectedReport.fileContent} 
                alt={`Medical report for Patient ${selectedReport.patientId}`} 
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            )
          )}
        </Box>
      );
    }
  };
  
  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          px: 3, 
          py: 2, 
          bgcolor: '#0b2434', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography variant="h5" component="h1" fontWeight="bold">
            RadioX Doctor Portal
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box 
            sx={{ 
              mr: 3, 
              position: 'relative', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <NotificationsIcon />
            {unreadReportsCount > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  bgcolor: '#e74c3c',
                  color: 'white',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}
              >
                {unreadReportsCount}
              </Box>
            )}
          </Box>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Welcome, {doctorName}
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '&:hover': { borderColor: '#ff7869', bgcolor: 'rgba(255,120,105,0.1)' }
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
      
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {renderContent()}
      </Container>
      
      {/* Report Viewer Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleCloseReportDialog}
        maxWidth="lg"
        fullWidth
      >
        {selectedReport && (
          <>
            <DialogTitle sx={{ bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                  {selectedReport.reportType} - Patient ID: {selectedReport.patientId}
                </Typography>
                <Tabs
                  value={viewMode}
                  onChange={handleViewModeChange}
                  aria-label="view mode tabs"
                >
                  <Tab 
                    label="Standard View" 
                    value="standard" 
                    icon={<ImageIcon fontSize="small" />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="DICOM Viewer" 
                    value="dicom" 
                    icon={<ViewInArIcon fontSize="small" />} 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#f9f9f9' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>File:</strong> {selectedReport.fileName}
                </Typography>
                <Typography variant="body2">
                  <strong>Uploaded:</strong> {new Date(selectedReport.dateUploaded).toLocaleString()}
                </Typography>
              </Box>
              {renderReportContent()}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
              <Button 
                onClick={handleCloseReportDialog}
                sx={{ color: '#7f8c8d' }}
              >
                Close
              </Button>
              <Button 
                variant="contained"
                sx={{ bgcolor: '#3498db', '&:hover': { bgcolor: '#2980b9' } }}
              >
                Download Report
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DoctorDashboard; 