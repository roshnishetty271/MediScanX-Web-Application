// doctor-service.js

import Doctor from '../models/doctor.js';

export const addDoctor = async (doctorData) => {
  try {
    const doctor = new Doctor(doctorData);
    await doctor.save();
    return { message: 'Doctor added successfully' };
  } catch (error) {
    console.error('Error while adding Doctor details:', error.message);
    throw new Error('Error while adding Doctor details');
  }
};

export const getPatientInfo = async (doctorId, patientId) => {
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const patient = doctor.patients.find((patient) => patient._id.toString() === patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    return {
      patientName: patient.patientName,
      patientLocation: patient.patientLocation,
      patientPhoneNumber: patient.patientPhoneNumber,
      patientScansDone: patient.patientScansDone,
      scannedImages: patient.scannedImages,
      remarks: patient.remarks,
    };
  } catch (error) {
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const doctor = await Doctor.findById(id);

    if (doctor) {
      console.log('Doctor found:', doctor);
      return { message: 'Doctor found successfully', doctor };
    } else {
      console.log('Doctor not found');
      throw new Error('Doctor not found');
    }
  } catch (error) {
    console.error('Error while getting Doctor by ID:', error.message);
    throw new Error('Error while getting Doctor by ID');
  }
};

export const updateDoctorById = async (id, updatedDoctor) => {
  try {
    console.log(`Updating doctor with ID: ${id}`);
    
    // Log the updated data
    console.log('Updated Doctor Data:', updatedDoctor);

    const result = await Doctor.findByIdAndUpdate(id, updatedDoctor, { new: true });

    if (result) {
      console.log('Doctor details updated successfully');
      console.log('Updated Doctor:', result);
      return { message: 'Doctor details updated successfully' };
    } else {
      console.log('Doctor not found');
      throw new Error('Doctor not found');
    }
  } catch (error) {
    console.error('Error while updating Doctor details:', error.message);
    throw new Error('Error while updating Doctor details');
  }
};


export const updateScansById = async (id, scansData) => {
  try {
    const result = await Doctor.findByIdAndUpdate(id, { $set: scansData }, { new: true });

    if (result) {
      console.log('Scans updated successfully');
      console.log('Updated Doctor:', result);
      return { message: 'Scans updated successfully', doctor: result };
    } else {
      console.log('Doctor not found');
      throw new Error('Doctor not found');
    }
  } catch (error) {
    console.error('Error while updating scans:', error.message);
    throw new Error('Error while updating scans');
  }
};


export const updateRemarks = async (doctorId, patientId, remarks, patientScansDone) => {
  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    const patient = doctor.patients.find((p) => p._id.toString() === patientId);

    if (!patient) {
      throw new Error('Patient not found');
    }

    if (patient.remarks !== remarks || patient.patientScansDone !== patientScansDone) {
      patient.remarks = remarks;
      patient.patientScansDone = true;
      await doctor.save();
    }

    return doctor;
  } catch (error) {
    // Customize the error message or handle differently if needed
    throw new Error(`Error updating remarks: ${error.message}`);
  }
};

// Add new function to get all doctors
export const getAllDoctors = async () => {
  try {
    const doctors = await Doctor.find();
    console.log(`Found ${doctors.length} doctors in the database`);
    // Return a structured response
    return { 
      message: 'Doctors retrieved successfully',
      doctors: doctors 
    };
  } catch (error) {
    console.error('Error fetching doctors:', error.message);
    throw new Error('Error fetching doctors');
  }
};