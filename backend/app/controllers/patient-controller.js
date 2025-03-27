import * as patientService from '../services/patient-service.js';
import { setResponse, setErrorResponse } from './response-handler.js';

export const deletePatientById = async(req, res) => {
    try {
        const id = req.params.id; // Assuming the patient ID is in the request parameters
        const result = await patientService.deleteById(id);
        setResponse(result, res);
    } catch (err) {
        setErrorResponse(err, res);
    }
};
/**
 * Controller function to handle patient registration.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const registerPatient = async(req, res) => {
    try {
        const patientData = {...req.body };
        const patient = await patientService.register(patientData);
        setResponse(patient, res);
    } catch (error) {
        setErrorResponse(error, res);
    }
};

/**
 * Controller function to handle updating patient information by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const updatePatient = async(req, res) => {
    try {
        // Extract patient ID and updated data from the request parameters and body
        const patientId = req.params.id;
        const updatedPatientData = {...req.body };

        // Call the update patient service
        const updatedPatient = await patientService.updatePatient(patientId, updatedPatientData);

        // Set a success response
        setResponse(updatedPatient, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};

/**
 * Controller function to handle deleting a patient by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const deletePatient = async(req, res) => {
    try {
        // Extract patient ID from the request parameters
        const patientId = req.params.id;

        // Call the delete patient service
        await patientService.deletePatient(patientId);

        // Set a success response
        setResponse({ message: 'Patient deleted successfully' }, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};

/**
 * Controller function to handle viewing patient information by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const viewPatientInfo = async(req, res) => {
    try {
        // Extract patient ID from the request parameters
        const patientId = req.params.id;

        // Call the get patient service
        const patient = await patientService.getPatient(patientId);

        // Set a success response
        setResponse(patient, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};

/**
 * Controller function to handle patient login.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const patientLogin = async(req, res) => {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;

        // Call the patient login service (implement this in patient-service.js)
        const patient = await patientService.loginPatient(username, password);

        // Set a success response
        setResponse({ message: 'Patient logged in successfully', patient }, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};

export const viewPatientReport = async(req, res) => {
    try {
        // Extract patient ID from the request parameters
        const patientId = req.params.id;

        // Call the get patient report service (if you have it implemented)
        const patientReport = await patientService.getPatientReport(patientId);

        // Set a success response
        setResponse(patientReport, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};