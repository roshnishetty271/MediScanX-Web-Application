import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import logo from "../../../images/navlogo.jpeg";
import CityButton from '../CityButton/cityButton';
import DoctorDropdown from '../DoctorDropdown/doctorDropdown'; 
import TimeSlotList from '../TimeSlotList/timeSlotList';
import './appointCalendar.css';

// Define appointment slot interface
interface AppointmentSlot {
  id: number;
  time: string;
  isAvailable: boolean;
  doctor?: string;
  location?: string;
}

// Define date value type
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Define component props
interface AppointCalendarProps {
  onTimeslotSelect?: (slot: any) => void;
}

function AppointCalendar({ onTimeslotSelect }: AppointCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [showUnavailableMessage, setShowUnavailableMessage] = useState(false);
  const [selectedUnavailableSlot, setSelectedUnavailableSlot] = useState<string>("");

  // Sample doctors
  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Brown', 'Dr. Williams'];

  // Sample time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  ];

  // Generate random unavailable slots for the selected date
  useEffect(() => {
    if (selectedDate) {
      // Reset existing slots
      const slots: AppointmentSlot[] = [];
      
      // Create slots with random availability
      timeSlots.forEach((time, index) => {
        // Random availability - 70% chance of being available
        const isAvailable = Math.random() < 0.7;
        
        // Create slot
        slots.push({
          id: index,
          time,
          isAvailable,
          doctor: selectedDoctor || undefined,
          location: selectedCity || undefined
        });
      });
      
      setAvailableSlots(slots);
    }
  }, [selectedDate, selectedCity, selectedDoctor]);
  
  // Handle button click for city selection
  const handleButtonClick = (city: string) => {
    setSelectedCity(city);
  };
  
  // Handle doctor dropdown selection
  const handleDoctorSelect = (doctor: string) => {
    setSelectedDoctor(doctor);
  };

  const handleCalendarChange = (value: Value) => {
    setSelectedDate(value);
  };

  const handleSlotClick = (slot: AppointmentSlot) => {
    if (!slot.isAvailable) {
      setSelectedUnavailableSlot(slot.time);
      setShowUnavailableMessage(true);
    } else if (onTimeslotSelect) {
      // Call the onTimeslotSelect callback when an available slot is clicked
      onTimeslotSelect(slot);
    }
  };

  const handleCloseMessage = () => {
    setShowUnavailableMessage(false);
  };

  // Get formatted date for display
  const getFormattedDate = () => {
    if (selectedDate instanceof Date) {
      return format(selectedDate, 'MMMM d, yyyy');
    }
    return 'Select a date';
  };

  // Convert the date to pass to TimeSlotList
  const getCurrentDate = (): Date | undefined => {
    if (selectedDate instanceof Date) {
      return selectedDate;
    }
    if (Array.isArray(selectedDate) && selectedDate[0] instanceof Date) {
      return selectedDate[0];
    }
    return undefined;
  };

  return (
    <div className="appointment-parent">
      <div className="appointment-header">
        <div className="logo-container">
          <img src={logo} alt="RadioX Logo" className="logo" />
          <h1>Appointment Scheduler</h1>
        </div>
      </div>
      
      <div className="appointment-container">
        <div className="left-container">
          <h2 className="section-title">Select Location</h2>
          <div className="city-buttons">
            <CityButton city="New York" onClick={handleButtonClick} isSelected={selectedCity === "New York"} />
            <CityButton city="Los Angeles" onClick={handleButtonClick} isSelected={selectedCity === "Los Angeles"} />
            <CityButton city="Chicago" onClick={handleButtonClick} isSelected={selectedCity === "Chicago"} />
            <CityButton city="Houston" onClick={handleButtonClick} isSelected={selectedCity === "Houston"} />
          </div>
          
          <h2 className="section-title">Select Doctor</h2>
          <DoctorDropdown doctors={doctors} onSelect={handleDoctorSelect} />
          
          <div className="calendar-container">
            <h2 className="section-title">Select Date</h2>
            <Calendar
              onChange={handleCalendarChange}
              value={selectedDate}
              className="modern-calendar"
              minDate={new Date()}
            />
          </div>
        </div>
        
        <div className="right-container">
          <div className="calendar-header">
            <h2 className="selected-date">{getFormattedDate()}</h2>
            <div className="availability-legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unavailable"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
          
          <div className="day-schedule">
            <h2 className="section-title">Available Time Slots</h2>
            <div className="time-slots-grid">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`time-slot-item ${slot.isAvailable ? 'available' : 'unavailable'}`}
                  onClick={() => handleSlotClick(slot)}
                >
                  {slot.time}
                  {!slot.isAvailable && <div className="booked-indicator">Booked</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showUnavailableMessage && (
        <div className="appointment-details-modal">
          <div className="appointment-details-content">
            <h3>Slot Not Available</h3>
            <p>The time slot at {selectedUnavailableSlot} is already booked. Please select another time slot.</p>
            <button onClick={handleCloseMessage}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointCalendar;