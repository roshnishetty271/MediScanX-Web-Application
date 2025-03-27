// Type declarations for appointment page components

declare module '../components/Appointment/AppointCalendar/appointCalendar' {
  interface AppointCalendarProps {
    onTimeslotSelect?: (slot: any) => void;
  }
  const AppointCalendar: React.FC<AppointCalendarProps>;
  export default AppointCalendar;
} 