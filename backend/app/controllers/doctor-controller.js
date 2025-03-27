// ./app/controllers/doctor-controller.js
import * as doctorService from '../services/doctor-service.js';
import { setErrorResponse, setResponse } from './response-handler.js';
import { getPatientInfo } from '../services/doctor-service.js';

export const registerDoctor = async (req, res) => {
    try {
        const doctorData = { ...req.body };
        const result = await doctorService.addDoctor(doctorData);
        setResponse(result, res);
    } catch (error) {
        setErrorResponse(error, res);
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const updatedDoctorData = { ...req.body };
        const result = await doctorService.updateDoctorById(doctorId, updatedDoctorData);
        setResponse(result, res);
    } catch (error) {
        setErrorResponse(error, res);
    }
};

export const getPatientInfoController = async (req, res) => {
    const { doctorId, patientId } = req.params;
  
    try {
      const patientInfo = await doctorService.getPatientInfo(doctorId, patientId);
      res.status(200).json({ patientInfo });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

// export const deleteDoctor = async (req, res) => {
//     try {
//         const doctorId = req.params.id;
//         const result = await doctorService.deleteDoctorById(doctorId);
//         setResponse(result, res);
//     } catch (error) {
//         setErrorResponse(error, res);
//     }
// };

/**
 * Controller function to handle viewing doctor information by ID.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const viewDoctorInfo = async (req, res) => {
    try {
        // Extract doctor ID from the request parameters
        const doctorId = req.params.id;

        // Call the get doctor service
        const doctor = await doctorService.getDoctorById(doctorId);

        // Set a success response
        setResponse(doctor, res);
    } catch (error) {
        // Set an error response in case of an exception
        setErrorResponse(error, res);
    }
};


// export const doctorLogin = async (req, res) => {
//     try {
//         // Extract username and password from the request body
//         const { username, password } = req.body;

//         // Call the doctor login service (implement this in doctor-service.js)
//         const doctor = await doctorService.loginDoctor(username, password);

//         // Set a success response
//         setResponse({ message: 'Doctor logged in successfully', doctor }, res);
//     } catch (error) {
//         setErrorResponse(error, res);
//     }
// };

export const updateScans = async (req, res) => {
    const doctorId = req.params.id; 
    const { scans_done, scans_pending } = req.body;
  
    try {
      const result = await doctorService.updateScansById(doctorId, { scans_done, scans_pending });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const updateRemarks = async (req, res) => {
    const { doctorId, patientId } = req.params;
    const { remarks, patientScansDone } = req.body;
  
    try {
      const updatedDoctor = await doctorService.updateRemarks(doctorId, patientId, remarks, patientScansDone);
      res.json(updatedDoctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Add new controller function to get all doctors
export const getAllDoctors = async (req, res) => {
  try {
    const result = await doctorService.getAllDoctors();
    console.log('Returning doctors data:', result);
    setResponse(result, res);
  } catch (error) {
    console.error('Error in getAllDoctors controller:', error);
    setErrorResponse(error, res);
  }
};
