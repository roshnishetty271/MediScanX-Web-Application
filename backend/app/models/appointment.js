import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    patientID: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    schedule: {
        startTime: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        }
    },
    location: {
        type: String,
        required: true
    },
    patientName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        }
    },
    doctorName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String
        }   
    },
    status: {
        type: String,
        required: true
    }
});

const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);

export default AppointmentModel;
