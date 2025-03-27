import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    scans_done: {
        type: Boolean,
        default: false,
    },
    remarks: {
        type: String,
    },
    assigned_doctor_email: {
        type: String,
    },
    scannedImages: [{
        data: Buffer,
        contentType: String,
    }, ],
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;