import * as patientService from './patient-service.js';
import * as doctorService from './doctor-service.js'; 
import * as appointmentService from './appointment-service.js';
import * as medicalReportService from './medical-report-service.js';
import Appointment from './appointment.js'
import ReportModel from './report.js'
import MedicalReport from './medical-report.js';
import Patient from './patient.js';

export default {
    patientService,
    doctorService, 
    appointmentService,
    medicalReportService,
    Appointment,
    ReportModel,
    MedicalReport,
    Patient,
}
