import express from 'express';
import * as appointmentController from '../controllers/appointment-controller.js';
import mongoose from 'mongoose';

const router = express.Router();

// Development route - direct access to MongoDB appointments (remove in production)
router.get('/raw', async (req, res) => {
  try {
    // Get the Appointment model directly from mongoose
    const Appointment = mongoose.model('Appointment');
    const appointments = await Appointment.find().lean();
    console.log('Raw appointments from MongoDB:', appointments);
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching raw appointments:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all appointments or filter by patientId
router.route('/').get(appointmentController.getAllAppointments);

// Get appointments for a specific patient (alternative endpoint format)
router.route('/patient/:id').get((req, res) => {
    // Forward to getAllAppointments with the patientId as a query parameter
    req.query.patientId = req.params.id;
    appointmentController.getAllAppointments(req, res);
});

router.route('/schedule').post(appointmentController.scheduleAppointment)

router.route('/:id').get(appointmentController.getAppointment)
     
router.route('/update/:id').put(appointmentController.updateAppointment)
     
router.route('/cancel/:id').patch(appointmentController.cancelAppointment)

// route.route('/slots').
export default router
