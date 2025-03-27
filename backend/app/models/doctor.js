import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  scans_done: {
    type: String,
    required: true,
  },
  scans_pending: {
    type: String,
    required: true,
  },
  patients: [
    {
      patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
      },
      patientName: String,
      patientLocation: String,
      patientPhoneNumber: String,
      patientScansDone: Boolean,
      remarks: String,
      scannedImages: String
    },
  ],
});

const Doctor = mongoose.model('Doctor', doctorSchema);

export default Doctor;
