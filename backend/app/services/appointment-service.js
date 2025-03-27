import Appointment from '../models/appointment.js'
import mongoose from 'mongoose'

export const findAll = async () => {
    try {
        console.log('Executing findAll appointments query');
        const appointments = await Appointment.find().lean().exec();
        console.log(`Found ${appointments.length} appointments`);
        return appointments;
    } catch (error) {
        console.error('Error in findAll appointments:', error);
        throw error;
    }
}

export const findByPatientId = async (patientId) => {
    try {
        console.log(`Finding appointments for patient ID: ${patientId}`);
        const appointments = await Appointment.find({ patientID: patientId }).lean().exec();
        console.log(`Found ${appointments.length} appointments for patient ${patientId}`);
        return appointments;
    } catch (error) {
        console.error(`Error finding appointments for patient ${patientId}:`, error);
        throw error;
    }
}

export const search = async (id) => {
    try {
        console.log(`Finding appointment by ID: ${id}`);
        const appointment = await Appointment.findById(id).lean().exec();
        console.log(`Appointment found:`, appointment ? 'Yes' : 'No');
        return appointment;
    } catch (error) {
        console.error(`Error finding appointment ${id}:`, error);
        throw error;
    }
}

export const update = async (updatedAppointment, id) => {
    try {
        console.log(`Updating appointment ${id} with:`, updatedAppointment);
        const appointment = await Appointment.findByIdAndUpdate(id, updatedAppointment, { new: true }).exec();
        console.log("Updated appointment:", appointment);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        return appointment;
    } catch (error) {
        console.error(`Error updating appointment ${id}:`, error);
        throw error;
    }
}

export const save = async (newAppointment) => {
    try {
        console.log('Creating new appointment:', newAppointment);
        const appointment = new Appointment(newAppointment);
        const savedAppointment = await appointment.save();
        console.log('New appointment created with ID:', savedAppointment._id);
        return savedAppointment;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

export const remove = async (id, body) => {
    try {
        console.log(`Cancelling appointment ${id} with:`, body);
        const result = await Appointment.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        ).exec();
        console.log('Appointment cancelled result:', result);
        return result;
    } catch (error) {
        console.error(`Error cancelling appointment ${id}:`, error);
        throw error;
    }
}
