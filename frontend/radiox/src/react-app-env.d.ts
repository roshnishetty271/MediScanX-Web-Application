/// <reference types="react-scripts" />

// Fix module imports that TypeScript can't find
declare module './app/store' {
  import { store } from './app/store';
  export { store };
}

declare module './pages/home' {
  const Home: React.FC;
  export default Home;
}

declare module './components/Home/Login/Loginscreen' {
  const LoginScreen: React.FC;
  export default LoginScreen;
}

declare module './components/Home/Contact/contactus' {
  const ContactScreen: React.FC;
  export default ContactScreen;
}

declare module './components/Home/SignUp/SignUpPage' {
  const SignUpPage: React.FC;
  export default SignUpPage;
}

declare module './components/Home/Patient/PatientUI' {
  const PatientUI: React.FC;
  export default PatientUI;
}

declare module './components/Home/Patient/MyAppointments' {
  const MyAppointments: React.FC;
  export default MyAppointments;
}

declare module './pages/appointment' {
  const AppointmentPage: React.FC;
  export default AppointmentPage;
}

declare module './components/Appointment/Checkout/checkout' {
  const Checkout: React.FC;
  export default Checkout;
}

declare module './components/Appointment/EmailTest/EmailTest' {
  const EmailTest: React.FC;
  export default EmailTest;
}

declare module './pages/DoctorDashboard' {
  const DoctorDashboard: React.FC;
  export default DoctorDashboard;
}

declare module './pages/AdminDashboard' {
  const AdminDashboard: React.FC;
  export default AdminDashboard;
}

declare module '../components/Appointment/AppointCalendar/appointCalendar' {
  interface AppointCalendarProps {
    onTimeslotSelect?: (slot: any) => void;
  }
  const AppointCalendar: React.FC<AppointCalendarProps>;
  export default AppointCalendar;
}

declare module '../components/DicomViewer/DicomViewer' {
  interface DicomViewerProps {
    imageUrl: string;
    patientId: string;
    reportType: string;
  }
  const DicomViewer: React.FC<DicomViewerProps>;
  export default DicomViewer;
}

// Declare image file types
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';
