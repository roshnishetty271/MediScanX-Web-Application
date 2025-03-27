// models/medical-report.js

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MedicalReportSchema = new Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    reportDate: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    prescription: {
        type: String,
        required: true
    }
});

const MedicalReportModel = mongoose.model('MedicalReport', MedicalReportSchema);

export default MedicalReportModel;