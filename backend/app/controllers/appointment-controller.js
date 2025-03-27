import * as appointmentService from '../services/appointment-service.js'
import {setResponse, setErrorResponse} from './response-handler.js';

export const getAllAppointments = async (request, response) => {
    try {
        const patientId = request.query.patientId;
        let appointments;

        if (patientId) {
            // If patientId query param is provided, filter by patientID
            appointments = await appointmentService.findByPatientId(patientId);
        } else {
            // Otherwise get all appointments
            appointments = await appointmentService.findAll();
        }
        
        setResponse(appointments, response);
    } catch (err) {
        console.log(err);
        setErrorResponse(err, response);
    }
};

export const getAppointment = async (request, response) => {
    try{
        const id = request.params.id;
        const appointment = await appointmentService.search(id)
        setResponse(appointment, response)
    }
    catch(err){
        console.log(err)
        setErrorResponse(err, response)
    }
}

export const scheduleAppointment = async(request, response) => {
    try{
        const newAppointment = {...request.body}
        const appointment = await appointmentService.save(newAppointment)
        setResponse({
            message: "Appointment scheduled successfully",
            appointmentId: appointment.appointmentID
        }, response)        
    }
    catch(err){
        console.log(err)
        setErrorResponse(err, response)
    }
}

export const updateAppointment = async (request, response) => {
    try{
        const id = request.params.id;
        const updatedAppointment = {...request.body}
        console.log(updatedAppointment)
        console.log("id: ", id)
        const appointment = await appointmentService.update(updatedAppointment, id)
        
        setResponse({
            message: `Your appointment ${id} has been updated successfully`
        }, response)
    }
    catch(err){
        console.log(err)
        setErrorResponse(err, response)
    }
}

export const cancelAppointment = async (request, response) => {
    try{
        const id = request.params.id
        const cancelBody = {...request.body}
        await appointmentService.remove(id, cancelBody)
        setResponse({
            message: `Your appointment ${id} cancelled successfully`,
        }, response)

    }
    catch(err){
        setErrorResponse(err, response)

    }
}