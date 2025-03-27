import React, { useState } from 'react';
import "./doctorDropdown.css"


interface DoctorDropdownProps {
  doctors: string[]; // Array of doctor names
  onSelect: (doctor: string) => void; // Callback when a doctor is selected
}

const DoctorDropdown: React.FC<DoctorDropdownProps> = ({ doctors, onSelect }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedDoctor(value);
    onSelect(value);
    // You can perform additional actions when the doctor selection changes
  };

  return (
    <div>
      {/* <label htmlFor="doctorDropdown">Select a Doctor:</label> */}
      <select className="doctor-dropdown" id="doctorDropdown" value={selectedDoctor || ''} onChange={handleDoctorChange}>
        <option value="" disabled>
          Select a Doctor
        </option>
        {doctors.map((doctor, index) => (
          <option key={index} value={doctor}>
            {doctor}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DoctorDropdown;