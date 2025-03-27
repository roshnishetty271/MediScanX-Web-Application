// services/patient-service.js

import Patient from '../models/patient.js';
import MedicalReport from '../models/medical-report.js';

export const register = async(patientData = {}) => {
    const patient = await Patient.create(patientData);
    return patient;
};

export const updatePatient = async(patientId, updatedPatientData) => {
    return await Patient.findByIdAndUpdate(patientId, updatedPatientData, { new: true });
};

export const deletePatient = async(patientId) => {
    return await Patient.findByIdAndDelete(patientId);
};

export const getPatient = async(patientId) => {
    return await Patient.findById(patientId);
};

export const loginPatient = async(username, password) => {
    const patient = await Patient.findOne({ username });

    if (!patient) {
        throw new Error('Patient not found');
    }

    const isPasswordValid = patient.password === password;

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    return patient;
};

export const getPatientReport = async(patientId) => {

    const medicalReport = await MedicalReport.findOne({ patientId });

    if (!medicalReport) {
        throw new Error('Medical report not found');
    }

    return medicalReport;
};