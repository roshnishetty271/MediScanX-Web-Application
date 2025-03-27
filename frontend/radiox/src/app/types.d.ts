// Type declarations for modules without TypeScript definitions

declare module '@reduxjs/toolkit';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.webp';

// Component declarations
declare module '../components/Home/Contact/contactus' {
  const ContactScreen: React.FC;
  export default ContactScreen;
}

declare module '../components/Home/SignUp/SignUpPage' {
  const SignUpPage: React.FC;
  export default SignUpPage;
}

declare module '../components/Home/Patient/PatientUI' {
  const PatientUI: React.FC;
  export default PatientUI;
}

declare module '../components/Home/Patient/MyAppointments' {
  const MyAppointments: React.FC;
  export default MyAppointments;
}

declare module '../components/Appointment/Checkout/checkout' {
  const Checkout: React.FC;
  export default Checkout;
}

declare module '../components/Appointment/EmailTest/EmailTest' {
  const EmailTest: React.FC;
  export default EmailTest;
}

declare module '../pages/AdminDashboard' {
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