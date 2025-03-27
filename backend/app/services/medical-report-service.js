// services/medical-report-service.js

import MedicalReport from '../models/medical-report.js';

export const createMedicalReport = async(newMedicalReport) => {
    const medicalReport = new MedicalReport(newMedicalReport);
    return await medicalReport.save();
};

export const updateMedicalReport = async(reportId, updatedMedicalReport) => {
    return await MedicalReport.findByIdAndUpdate(reportId, updatedMedicalReport, { new: true });
};

export const deleteMedicalReport = async(reportId) => {
    return await MedicalReport.findByIdAndDelete(reportId);
};

export const getMedicalReport = async(reportId) => {
    return await MedicalReport.findById(reportId);
};