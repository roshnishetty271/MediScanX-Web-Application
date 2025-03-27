

import express from 'express';
import * as patientController from '../controllers/patient-controller.js';

const router = express.Router();

// Patient Registration
router.post('/register', patientController.registerPatient);

// Patient Login
router.post('/login', patientController.patientLogin);

// Delete Patient
router.delete('/delete/:id', patientController.deletePatient);

// Update Patient
router.put('/update/:id', patientController.updatePatient);

// View Patient Information
router.get('/viewinfo/:id', patientController.viewPatientInfo);

// View Patient's Medical Report
router.get('/viewreport/:id', patientController.viewPatientReport);

export default router;
