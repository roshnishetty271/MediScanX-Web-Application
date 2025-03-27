import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid, Button, Card, CardContent, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from 'axios';

// Interface for doctor data
interface Doctor {
  _id?: string;
  name?: string;
  specialty?: string;
  contactNumber?: string;
  address?: string;
  location?: string;
  email?: string;
  scans_done?: string;
  scans_pending?: string;
  patients?: any[];
  [key: string]: any; // Allow for any additional properties that might come from MongoDB
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [patientId, setPatientId] = useState('');
  const [reportType, setReportType] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [reports, setReports] = useState<any[]>([]);
  
  // New state variables for doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  
  // New doctor form state
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    contactNumber: '',
    address: '',
    location: '',
    email: '',
    scans_done: '0',
    scans_pending: '0'
  });
  const [addDoctorSuccess, setAddDoctorSuccess] = useState(false);
  const [addDoctorError, setAddDoctorError] = useState('');
  
  useEffect(() => {
    // Check if user is logged in as admin
    const userRole = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');
    
    if (userRole !== 'admin' || !username) {
      // Redirect to login if not logged in as admin
      navigate('/login');
    }
    
    // Load existing reports from localStorage
    const storedReports = localStorage.getItem('medicalReports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
    
    // Fetch doctors when component mounts
    fetchDoctors();
  }, [navigate]);
  
  // Function to fetch all doctors from the backend
  const fetchDoctors = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await axios.get('http://localhost:8000/doctors');
      console.log('Doctors API raw response:', response);
      
      // Detailed logging of the response structure
      if (response.data) {
        console.log('Response data type:', typeof response.data);
        console.log('Response data full contents:', JSON.stringify(response.data, null, 2));
        
        if (response.data.doctors) {
          console.log('Found doctors array in response.data.doctors');
          setDoctors(response.data.doctors);
          console.log('Doctor data sample:', response.data.doctors[0]);
        } else if (response.data.message && response.data.doctors) {
          console.log('Found doctors array in structured response');
          setDoctors(response.data.doctors);
        } else if (Array.isArray(response.data)) {
          console.log('Response data is a direct array');
          setDoctors(response.data);
          console.log('Doctor data sample:', response.data[0]);
        } else {
          // The response might have a different structure
          console.log('Searching for doctors array in response...');
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            console.log('Found possible doctors array:', possibleArrays[0]);
            setDoctors(possibleArrays[0] as Doctor[]);
          } else {
            console.error('Could not find doctor data in response:', response.data);
            setFetchError('Received unexpected data format. Please try again.');
          }
        }
      } else {
        console.error('No data in response');
        setFetchError('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setFetchError('Failed to fetch doctors. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };
  
  // Handle input changes for the new doctor form
  const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle submission of the new doctor form
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!newDoctor.name || !newDoctor.specialty || !newDoctor.contactNumber || 
        !newDoctor.address || !newDoctor.location || !newDoctor.email) {
      setAddDoctorError('Please fill all required fields');
      return;
    }
    
    setAddDoctorError('');
    setIsLoading(true);
    
    try {
      // Send request to add doctor
      const response = await axios.post('http://localhost:8000/doctors', newDoctor);
      console.log('Add doctor response:', response.data);
      
      // Show success message
      setAddDoctorSuccess(true);
      
      // Reset form
      setNewDoctor({
        name: '',
        specialty: '',
        contactNumber: '',
        address: '',
        location: '',
        email: '',
        scans_done: '0',
        scans_pending: '0'
      });
      
      // Add a small delay before fetching doctors to ensure the backend has processed the new data
      console.log('Waiting before refreshing doctor list...');
      setTimeout(() => {
        console.log('Now refreshing doctor list');
        // Refresh doctor list
        fetchDoctors();
      }, 1000);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setAddDoctorSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding doctor:', error);
      if (axios.isAxiosError(error) && error.response) {
        // If we have a response from the server with an error message
        console.error('Server error details:', error.response.data);
        setAddDoctorError(`Failed to add doctor: ${error.response.data.message || 'Server error'}`);
      } else {
        setAddDoctorError('Failed to add doctor. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
    }
  };
  
  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportFile || !patientId || !reportType) {
      setUploadError('Please fill all fields and select a file');
      return;
    }
    
    setUploadError('');
    
    // Create a reader to read the file
    const reader = new FileReader();
    reader.onload = () => {
      // Create a new report object
      const newReport = {
        id: `report-${Date.now()}`,
        patientId,
        reportType,
        fileName: reportFile.name,
        dateUploaded: new Date().toISOString(),
        fileContent: reader.result,
        viewed: false
      };
      
      // Add to the reports list
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      
      // Save to localStorage
      localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
      
      // Reset form and show success message
      setReportFile(null);
      setPatientId('');
      setReportType('');
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    };
    
    // Read the file as DataURL (base64)
    reader.readAsDataURL(reportFile);
  };
  
  const handleDeleteReport = (reportId: string) => {
    const updatedReports = reports.filter(report => report.id !== reportId);
    setReports(updatedReports);
    localStorage.setItem('medicalReports', JSON.stringify(updatedReports));
  };
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          flexShrink: 0,
          bgcolor: '#0b2434',
          color: 'white',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          overflowY: 'auto'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Admin Portal
          </Typography>
        </Box>
        
        <List sx={{ pt: 2 }}>
          <ListItem 
            button 
            selected={activeSection === 'dashboard'}
            onClick={() => setActiveSection('dashboard')}
            sx={{ 
              '&.Mui-selected': { 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: '4px solid #ff7869'
              },
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'doctors'}
            onClick={() => setActiveSection('doctors')}
            sx={{ 
              '&.Mui-selected': { 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: '4px solid #ff7869'
              },
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <LocalHospitalIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Doctors" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'patients'}
            onClick={() => setActiveSection('patients')}
            sx={{ 
              '&.Mui-selected': { 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: '4px solid #ff7869'
              },
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Patients" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'reports'}
            onClick={() => setActiveSection('reports')}
            sx={{ 
              '&.Mui-selected': { 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: '4px solid #ff7869'
              },
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <InsertChartIcon />
            </ListItemIcon>
            <ListItemText primary="Reports & Analytics" />
          </ListItem>
          
          <ListItem 
            button 
            selected={activeSection === 'settings'}
            onClick={() => setActiveSection('settings')}
            sx={{ 
              '&.Mui-selected': { 
                bgcolor: 'rgba(255, 255, 255, 0.08)',
                borderLeft: '4px solid #ff7869'
              },
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="System Settings" />
          </ListItem>
          
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
          
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'white' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Box>
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, pl: '240px', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="#2c3e50" mb={4}>
            {activeSection === 'dashboard' && 'Admin Dashboard'}
            {activeSection === 'doctors' && 'Manage Doctors'}
            {activeSection === 'patients' && 'Manage Patients'}
            {activeSection === 'reports' && 'Reports & Analytics'}
            {activeSection === 'settings' && 'System Settings'}
          </Typography>
          
          {activeSection === 'dashboard' && (
            <>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#fff', boxShadow: 2 }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Doctors
                      </Typography>
                      <Typography variant="h4" component="div" color="#3498db" fontWeight="bold">
                        {doctors.length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Active accounts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#fff', boxShadow: 2 }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Patients
                      </Typography>
                      <Typography variant="h4" component="div" color="#2ecc71" fontWeight="bold">
                        568
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Registered users
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#fff', boxShadow: 2 }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Appointments
                      </Typography>
                      <Typography variant="h4" component="div" color="#f39c12" fontWeight="bold">
                        152
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        This month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ bgcolor: '#fff', boxShadow: 2 }}>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Revenue
                      </Typography>
                      <Typography variant="h4" component="div" color="#9b59b6" fontWeight="bold">
                        $42.5K
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        This month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Typography variant="h5" component="h2" fontWeight="bold" color="#2c3e50" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<PersonAddIcon />}
                    sx={{ 
                      py: 3, 
                      bgcolor: '#3498db',
                      '&:hover': { bgcolor: '#2980b9' }
                    }}
                    onClick={() => setActiveSection('doctors')}
                  >
                    Add New Doctor
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<InsertChartIcon />}
                    sx={{ 
                      py: 3, 
                      bgcolor: '#9b59b6',
                      '&:hover': { bgcolor: '#8e44ad' }
                    }}
                    onClick={() => setActiveSection('reports')}
                  >
                    View Reports
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          
          {activeSection === 'reports' && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                      Upload Medical Report
                    </Typography>
                    
                    <form onSubmit={handleUploadReport}>
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Patient ID:</Typography>
                        <input
                          type="text"
                          value={patientId}
                          onChange={(e) => setPatientId(e.target.value)}
                          placeholder="Enter patient ID"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Report Type:</Typography>
                        <select
                          value={reportType}
                          onChange={(e) => setReportType(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Select Report Type</option>
                          <option value="X-Ray">X-Ray</option>
                          <option value="MRI">MRI</option>
                          <option value="CT Scan">CT Scan</option>
                          <option value="Ultrasound">Ultrasound</option>
                          <option value="Blood Test">Blood Test</option>
                          <option value="Pathology">Pathology</option>
                        </select>
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Report File:</Typography>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                        <Typography variant="caption" display="block" mt={1} color="text.secondary">
                          Accepted formats: PDF, JPG, JPEG, PNG
                        </Typography>
                      </Box>
                      
                      {uploadError && (
                        <Box mb={2} p={1} bgcolor="#ffebee" color="#d32f2f" borderRadius={1}>
                          <Typography variant="body2">{uploadError}</Typography>
                        </Box>
                      )}
                      
                      {uploadSuccess && (
                        <Box mb={2} p={1} bgcolor="#e8f5e9" color="#2e7d32" borderRadius={1}>
                          <Typography variant="body2">Report uploaded successfully!</Typography>
                        </Box>
                      )}
                      
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: '#3498db',
                          '&:hover': { bgcolor: '#2980b9' }
                        }}
                      >
                        Upload Report
                      </Button>
                    </form>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                      Recent Uploads
                    </Typography>
                    
                    {reports.length === 0 ? (
                      <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                        No reports have been uploaded yet
                      </Typography>
                    ) : (
                      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                        {reports.slice().reverse().map((report) => (
                          <Box 
                            key={report.id} 
                            sx={{ 
                              mb: 2, 
                              p: 2, 
                              border: '1px solid #e0e0e0', 
                              borderRadius: 1,
                              '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle1" fontWeight="medium">
                                {report.reportType} - Patient {report.patientId}
                              </Typography>
                              <Button 
                                size="small" 
                                color="error" 
                                onClick={() => handleDeleteReport(report.id)}
                              >
                                Delete
                              </Button>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {report.fileName}
                            </Typography>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Uploaded: {new Date(report.dateUploaded).toLocaleString()}
                            </Typography>
                            <Box 
                              sx={{ 
                                mt: 1, 
                                display: 'flex', 
                                alignItems: 'center',
                                color: report.viewed ? 'success.main' : 'warning.main'
                              }}
                            >
                              <Typography variant="caption">
                                {report.viewed ? 'Viewed by doctor' : 'Not viewed yet'}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
          
          {activeSection === 'doctors' && (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                      Add New Doctor
                    </Typography>
                    
                    <form onSubmit={handleAddDoctor}>
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Name:</Typography>
                        <input
                          type="text"
                          name="name"
                          value={newDoctor.name}
                          onChange={handleDoctorInputChange}
                          placeholder="Enter doctor's full name"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Specialty:</Typography>
                        <select
                          name="specialty"
                          value={newDoctor.specialty}
                          onChange={handleDoctorInputChange}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Select Specialty</option>
                          <option value="Radiology">Radiology</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Cardiology">Cardiology</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="General Medicine">General Medicine</option>
                        </select>
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Contact Number:</Typography>
                        <input
                          type="text"
                          name="contactNumber"
                          value={newDoctor.contactNumber}
                          onChange={handleDoctorInputChange}
                          placeholder="Enter contact number"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Email:</Typography>
                        <input
                          type="email"
                          name="email"
                          value={newDoctor.email}
                          onChange={handleDoctorInputChange}
                          placeholder="Enter email address"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Address:</Typography>
                        <input
                          type="text"
                          name="address"
                          value={newDoctor.address}
                          onChange={handleDoctorInputChange}
                          placeholder="Enter address"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        />
                      </Box>
                      
                      <Box mb={2}>
                        <Typography variant="body2" mb={1}>Location:</Typography>
                        <select
                          name="location"
                          value={newDoctor.location}
                          onChange={handleDoctorInputChange}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}
                        >
                          <option value="">Select Location</option>
                          <option value="New York">New York</option>
                          <option value="Boston">Boston</option>
                          <option value="Chicago">Chicago</option>
                          <option value="Los Angeles">Los Angeles</option>
                        </select>
                      </Box>
                      
                      {addDoctorError && (
                        <Box mb={2} p={1} bgcolor="#ffebee" color="#d32f2f" borderRadius={1}>
                          <Typography variant="body2">{addDoctorError}</Typography>
                        </Box>
                      )}
                      
                      {addDoctorSuccess && (
                        <Box mb={2} p={1} bgcolor="#e8f5e9" color="#2e7d32" borderRadius={1}>
                          <Typography variant="body2">Doctor added successfully!</Typography>
                        </Box>
                      )}
                      
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          bgcolor: '#3498db',
                          '&:hover': { bgcolor: '#2980b9' }
                        }}
                      >
                        {isLoading ? 'Adding...' : 'Add Doctor'}
                      </Button>
                    </form>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
          
          {activeSection === 'patients' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                Manage Patients
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                    <Typography variant="body1" mb={2}>
                      This section allows administrators to manage patient records, view and update patient information, 
                      and track patient appointments and medical history.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'white', 
                        borderRadius: 1, 
                        boxShadow: 1,
                        width: { xs: '100%', sm: '48%' } 
                      }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>Patient Records</Typography>
                        <Typography variant="body2" color="text.secondary">
                          View and manage detailed patient information, including demographics, 
                          contact details, and health history.
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        p: 2, 
                        bgcolor: 'white', 
                        borderRadius: 1, 
                        boxShadow: 1,
                        width: { xs: '100%', sm: '48%' } 
                      }}>
                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>Appointment History</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Access patient appointment records, view completed and upcoming visits, 
                          and manage appointment scheduling.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={2}>
                    Coming Soon
                  </Typography>
                  <Typography color="text.secondary">
                    Complete patient management features will be implemented in the next update. 
                    This will include advanced search, filtering, and reporting capabilities.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
          
          {activeSection === 'settings' && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" component="h2" fontWeight="bold" mb={2}>
                System Settings
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <List>
                    <ListItem sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="User Management" 
                        secondary="Manage system users, roles, and permissions"
                      />
                    </ListItem>
                    
                    <ListItem sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      <ListItemIcon>
                        <SettingsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="System Configuration" 
                        secondary="Adjust system settings and preferences"
                      />
                    </ListItem>
                    
                    <ListItem sx={{ 
                      p: 2, 
                      mb: 2, 
                      bgcolor: '#f8f9fa', 
                      borderRadius: 1,
                      border: '1px solid #e0e0e0'
                    }}>
                      <ListItemIcon>
                        <InsertChartIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Reporting Settings" 
                        secondary="Configure system-wide reporting and analytics"
                      />
                    </ListItem>
                  </List>
                  
                  <Typography variant="subtitle1" fontWeight="bold" mt={3} mb={2}>
                    Coming Soon
                  </Typography>
                  <Typography color="text.secondary">
                    Full system settings functionality will be implemented in the next phase. This will include
                    backup settings, notification configurations, and advanced security options.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 