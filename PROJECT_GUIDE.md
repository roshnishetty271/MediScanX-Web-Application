# MediScanX Medical Management System - Project Guide

## Project Overview
MediScanX is a comprehensive healthcare management system designed to streamline radiology services and appointment scheduling. The application connects patients, doctors, and administrators in a unified platform, enabling efficient management of medical appointments, reports, and patient records with special focus on radiology imaging.

### Key Features
- **Patient Portal**: Schedule appointments, manage personal information, view and cancel appointments
- **Doctor Dashboard**: View appointments, manage patient records, view medical reports with DICOM viewer, track analytics
- **Admin Panel**: Manage doctors, view system analytics, upload medical reports, system configuration
- **DICOM Viewer**: Specialized medical imaging viewer for radiological scans
- **Real-time Database**: MongoDB integration for instant updates to appointments and records

## Tech Stack

### Frontend
- **React.js**: Core library for building the user interface
- **TypeScript**: For type-safe JavaScript code
- **Material-UI**: Component library for modern UI design
- **React Router**: For application routing
- **Axios**: HTTP client for API requests
- **Redux Toolkit**: State management
- **Chart.js/ApexCharts**: Data visualization libraries
- **EmailJS**: Email notification service
- **DWV.js**: DICOM Web Viewer library for medical imaging

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing appointment and user data
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-Origin Resource Sharing support
- **Nodemon**: Development tool for auto-restarting the server

## Setup Instructions

### Prerequisites
- Node.js (v14 or newer)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation Steps

#### 1. Backend Setup

# Install backend dependencies
npm install

# Initialize the database with seed data
npm run init-db

# Start the backend server
npm start

The backend server will start on http://localhost:8000

#### 2. Frontend Setup

# Navigate to the frontend directory
cd frontend/radiox

# Install frontend dependencies
npm install

# Start the frontend development server
npm start

The frontend application will start on http://localhost:3000

## Database Configuration
The application uses MongoDB for data storage. The connection string can be configured in the `.env` file in the root directory:

```
MONGODB_URI=mongodb://localhost:27017/MasterDb
PORT=8000
```

If you're using MongoDB Atlas, replace the connection string with your Atlas URI.

### MongoDB Collections
- **doctors**: Stores doctor information and credentials
- **appointments**: Stores all patient appointments with status (scheduled, completed, cancelled)
- **users**: Stores user authentication information
- **medicalReports**: Stores medical report metadata and file references

## User Roles and Login Credentials

### 1. Patient Login
- **Username**: patient
- **Password**: patient123

### 2. Doctor Login
- **Username**: doctor1
- **Password**: doctor123
- **Alternative**: 
  - **Username**: doctor2
  - **Password**: doctor123

### 3. Admin Login
- **Username**: admin
- **Password**: admin123

## Demonstration Flows

### Flow 1: Patient Appointment Booking
1. Log in as a patient using the patient credentials
2. Navigate to the "Schedule Appointment" button on the dashboard
3. Select a city from the options (e.g., New York)
4. Choose a doctor from the dropdown menu
5. Select a date from the calendar
6. Choose an available time slot (shown in green)
7. Complete the booking process by clicking "Book Appointment"
8. View the confirmation dialog showing appointment details
9. Return to the patient dashboard by clicking "Back to Profile"
10. Show the "My Appointments" section to see the booked appointment
11. **MongoDB Integration**: Explain that the appointment data is stored in the MongoDB database in real-time, and you can show this by logging into MongoDB Compass to view the appointments collection

### Flow 2: Appointment Cancellation
1. From the patient dashboard, click on "My Appointments"
2. Find an existing appointment in the list
3. Click the "Cancel" button on any appointment
4. Confirm the cancellation in the dialog that appears
5. Show the cancellation confirmation and status change
6. **MongoDB Integration**: Explain that the appointment status in MongoDB is updated to "cancelled" in real-time
7. Refresh the appointments list to show the updated status

### Flow 3: Doctor Dashboard & Patient Management
1. Log in as a doctor using the doctor credentials
2. Demonstrate the dashboard overview with analytics:
   - **Quick Stats**: Shows counts of patients, scans done, pending scans
   - **Patient Visits Graph**: Shows monthly visit trends
   - **Completion Rate**: Circular progress indicator showing efficiency
3. Navigate to the "Schedule" section via the quick action button
   - Show the upcoming appointments calendar
   - Explain how doctors can view their daily/weekly schedule
   - Point out the appointment details including patient info and reason for visit
4. Return to dashboard and navigate to "Patients" section
   - Demonstrate the patient list with search functionality
   - Show how to access individual patient records
   - Explain the patient history and previous visits
5. Go to "Reports" section and show how medical reports are viewed
   - Demonstrate the report filtering options
   - Show how reports are categorized by type (X-ray, MRI, CT Scan)
6. **DICOM Viewer Demonstration**:
   - Select a radiology report to open the DICOM viewer
   - Show the specialized tools for medical imaging:
     - Zoom and pan functionality
     - Window/level adjustment (brightness/contrast)
     - Measurement tools for accurate diagnostics
     - Multiple view modes for different analysis needs
   - Explain how this specialized viewer helps doctors analyze medical images precisely
7. Show how doctors can add notes to patient records and update scan statuses
8. **MongoDB Integration**: Explain that all changes made by doctors are stored in MongoDB and can be retrieved by other authorized users

### Flow 4: Admin System Management
1. Log in as an admin using the admin credentials
2. Explore the admin dashboard with system statistics:
   - Total Doctors counter
   - Total Patients counter
   - Appointments metrics
   - Revenue overview
3. Navigate to "Manage Doctors" section
4. Demonstrate how to add a new doctor to the system:
   - Fill out the form with sample doctor information
   - Submit the form and show the success message
   - **MongoDB Integration**: Explain that the new doctor is added to the MongoDB database
5. Navigate to "Reports & Analytics" section
6. Show how to upload a medical report for a patient:
   - Enter patient ID
   - Select report type (X-Ray, MRI, etc.)
   - Upload a sample file
   - Show the success confirmation
7. Explain the system settings and user management capabilities

## DICOM Viewer - Detailed Overview

The RadioX system includes a specialized DICOM (Digital Imaging and Communications in Medicine) viewer for handling medical images. This is a critical component for radiologists and medical professionals.

### DICOM Viewer Features
- **Multi-format Support**: Handles various DICOM image formats used in radiology
- **Interactive Tools**: 
  - Zoom/Pan: For detailed examination of specific areas
  - Window/Level: Adjusts brightness and contrast for optimal visualization
  - Measurement: For precise size and distance calculations
  - Annotations: For adding notes directly on images
- **View Modes**:
  - Standard view: Regular image display
  - DICOM view: Technical view with all DICOM tags and metadata
- **Integration**: Seamlessly integrated with the patient record system
- **Performance**: Optimized for quick loading of large medical images

### Technical Implementation
The DICOM viewer is implemented using DWV (DICOM Web Viewer) library, which is integrated into the React application. The component is located in `frontend/radiox/src/components/DicomViewer/DicomViewer.tsx` and styled with the corresponding CSS file.

## MongoDB Integration - Real-time Data Updates

### Appointment Workflow in MongoDB
1. **Creation**: When a patient books an appointment, a new document is created in the appointments collection
2. **Retrieval**: Doctors and patients can view appointments based on their respective IDs
3. **Updates**: Status changes (completed, cancelled) are updated in real-time
4. **Analytics**: Appointment data is aggregated for the analytics dashboards

### Database Schema Overview
- **Doctor Schema**: Stores doctor credentials, specialty, contact info, and patient references
- **Appointment Schema**: Stores appointment details including:
  - Patient and doctor IDs
  - Date and time
  - Service type
  - Status (scheduled, cancelled, completed)
  - Location
- **Medical Report Schema**: Stores report metadata and references to image files

## Technical Notes for Presentation

### Backend Architecture
- REST API design with controller-service-model pattern
- MongoDB schema design for healthcare data
- Authentication and role-based access control
- Error handling and response standardization

### Frontend Architecture
- Component-based UI structure
- React hooks for state management
- TypeScript interfaces for type safety
- Responsive design for all device sizes
- Custom DICOM viewer integration

### Key Implementation Details
- Real-time data updates through MongoDB
- Dynamic form validation
- Conditional rendering based on user roles
- Secure data handling for medical information
- Integration with medical imaging standards
- Email notifications for appointments

## Button Functionality Reference

### Patient Dashboard
- **Schedule Appointment**: Navigates to appointment scheduling interface
- **View Appointments**: Shows list of past and upcoming appointments
- **Edit Profile**: Opens form to update personal information
- **Contact Us**: Opens contact form to reach support
- **Back to Profile**: Returns to the main patient dashboard from any sub-section

### Appointment Management
- **Book Appointment**: Confirms and creates a new appointment
- **Cancel Appointment**: Initiates cancellation process for an existing appointment
- **Confirm Cancellation**: Finalizes the cancellation and updates status in MongoDB
- **Reschedule**: Opens interface to select a new date/time for an appointment
- **Go to Payment**: Navigates to payment processing for appointments

### Doctor Dashboard
- **View Reports**: Shows medical reports assigned to the doctor
- **View Schedule**: Displays the doctor's appointment calendar
- **Manage Patients**: Opens the patient management interface
- **View Analytics**: Shows performance metrics and statistics
- **Back to Dashboard**: Returns to the main doctor dashboard

### Admin Dashboard
- **Add Doctor**: Creates a new doctor entry in the system
- **View Reports**: Accesses the report management system
- **Upload Report**: Opens interface to upload new medical reports
- **Refresh List**: Updates the current view with the latest data from MongoDB
- **Delete**: Removes items (reports, etc.) from the system

## Common Issues & Troubleshooting

### Backend Connection Issues
If the frontend cannot connect to the backend, ensure:
1. Backend server is running on port 8000
2. No firewall is blocking the connection
3. The CORS settings are properly configured

### MongoDB Connection Issues
If the backend cannot connect to MongoDB:
1. Ensure MongoDB service is running
2. Check the connection string in the .env file
3. Verify network connectivity to MongoDB Atlas (if using cloud)
4. Check MongoDB Compass to verify database accessibility

### DICOM Viewer Issues
If the DICOM viewer is not displaying images correctly:
1. Ensure the file format is supported
2. Check browser compatibility (Chrome/Firefox recommended)
3. Verify that the browser has sufficient memory for large images

### Demonstration Preparation Tips
1. Start both servers before the presentation
2. Have the login credentials readily available
3. Clear browser cache if you encounter unexpected behavior
4. Have a backup plan in case of network issues (screenshots/video)
5. Pre-upload some sample DICOM images for the demonstration

## Project Structure Overview
- `/backend` - Node.js/Express backend code
  - `/app` - Application code
    - `/controllers` - Request handlers
    - `/models` - MongoDB models
    - `/routes` - API routes
    - `/services` - Business logic
    - `/seeder.js` - Database initialization script
- `/frontend/radiox` - React frontend code
  - `/src` - Source code
    - `/components` - React components
      - `/Appointment` - Appointment-related components
      - `/DicomViewer` - DICOM visualization components
      - `/Home` - Dashboard and landing pages
    - `/pages` - Main application pages
    - `/images` - Static images
    - `/app` - Redux store configuration

## Future Enhancements
- Integration with payment gateways
- Advanced medical imaging analysis with AI support
- Mobile application development
- AI-assisted diagnosis recommendations
- Telemedicine video consultation
- Integration with wearable health devices
- Natural language processing for medical reports
