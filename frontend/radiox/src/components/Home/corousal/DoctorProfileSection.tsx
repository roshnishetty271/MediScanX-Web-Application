// DoctorProfileSection.tsx
import React from 'react';
import './DoctorProfileSection.css'; 
import radiology from '../../../images/Radiology.jpg';
import cardiologist from '../../../images/cardiologist.jpg';
import neurologist from '../../../images/neurologist.jpg';
//import pediatrician from '../images/pediatrician .jpg';
import ortho from '../../../images/ortho.jpg';

interface DoctorProfile {
  profilePicture: JSX.Element; 
  name: string;
  specialty: string;
  description: string;
}

const DoctorProfileSection: React.FC = () => {
  const doctorProfiles: DoctorProfile[] = [
    { profilePicture: <img className="profile-image" src={radiology} alt="Dr. John Doe" />, name: 'Dr. John Doe', specialty: 'Dr. John Doe', description: 'Medical Director of Incepto Medical France, Head of Radiology Clinic at CHU Poitiers' },
    { profilePicture: <img className="profile-image" src={cardiologist} alt="Dr. Michael Smith" />, name: 'Dr. Michael Smith', specialty: 'Dr. Michael Smith', description: 'Principal Investigator of CREATE Project in Hacettepe University, sponsored by AZ Turkey' },
    { profilePicture: <img className="profile-image" src={neurologist} alt="Dr. Sarah Adams" />, name: 'Dr. Sarah Adams', specialty: 'Dr. Sarah Adams', description: 'Consultant Radiologist, Clinical Lead for Diagnostics, Digital, and Innovation at Greater Manchester Cancer Alliance' },
    //{ profilePicture: <img className="profile-image" src={pediatrician} alt="Dr. Emily Johnson" />, name: 'Dr. Emily Johnson', specialty: 'Pediatrician', description: 'Dr. Emily Johnson, a compassionate pediatrician, specializes in the health and well-being of children. Dedicated to promoting growth and development, Dr. Johnson provides attentive care to young patients.' },
    { profilePicture: <img className="profile-image" src={ortho} alt="Dr. Christopher Lee" />, name: 'Dr. Christopher Lee', specialty: 'Dr. Christopher Lee', description: 'Principal Investigator of MedicoTech Research Institute, Director of Radiology at HSU University'},
  ];

  return (
    <div className="section-parent">
      <div className='section-title'>
        <h2>MEET OUR HEADS</h2>
      </div>
      <div className="section-container">
        {doctorProfiles.map((doctor, index) => (
          <div key={index} className="profile-container">
            {doctor.profilePicture}
            <div className="specialty">{doctor.specialty}</div>
            <div className="description">{doctor.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorProfileSection;
