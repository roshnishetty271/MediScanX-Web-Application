import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import Doctor from './models/doctor.js';
import Appointment from './models/appointment.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the same environment variable as in app.js
const mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MasterDb';

// Helper function to read DICOM image file
function readDicomImage(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return {
      data: data,
      contentType: 'application/dicom',
    };
  } catch (error) {
    console.error('Error reading DICOM image:', error);
    return null;
  }
}

// Sample data for seeding
const sampleDoctors = [
  {
    name: 'Dr. John Doe',
    specialty: 'Cardiology',
    contactNumber: '1234567890',
    address: '123 Main Street',
    location: 'City A',
    email: 'abc@example.com',
    scans_done: '50',
    scans_pending: '10',
    patients: [
      {
        patientName: 'Alice Johnson',
        patientLocation: 'Location 1',
        patientPhoneNumber: '1234567891',
        patientScansDone: true,
        remarks: 'Sample remark',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      },
      {
        patientName: 'Eva Davis',
        patientLocation: 'Location 5',
        patientPhoneNumber: '8765432111',
        patientScansDone: false,
        remarks: 'Yet another sample remark',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      },
      {
        patientName: 'Frank Miller',
        patientLocation: 'Location 6',
        patientPhoneNumber: '8765432112',
        patientScansDone: true,
        remarks: 'Sample remark for Frank',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      },
      {
        patientName: 'Grace Turner',
        patientLocation: 'Location 7',
        patientPhoneNumber: '8765432113',
        patientScansDone: false,
        remarks: 'Sample remark for Grace',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      },
      {
        patientName: 'Henry White',
        patientLocation: 'Location 8',
        patientPhoneNumber: '8765432114',
        patientScansDone: true,
        remarks: 'Sample remark for Henry',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      },
      // Add more patients as needed
    ],
  },
  {
    name: 'Dr. Jane Smith',
    specialty: 'Radiology',
    contactNumber: '9876543210',
    address: '456 Oak Avenue',
    location: 'New York',
    email: 'jane.smith@example.com',
    scans_done: '75',
    scans_pending: '5',
    patients: [
      {
        patientName: 'Bob Williams',
        patientLocation: 'Location 2',
        patientPhoneNumber: '2345678901',
        patientScansDone: true,
        remarks: 'Another sample remark',
        scannedImages: "https://i.ibb.co/CVqgnq8/demo.jpg"
      }
    ]
  }
];

// Sample appointments
const sampleAppointments = [
  {
    patientID: "123456",
    serviceName: "X-Ray Scan",
    date: new Date().toISOString().split('T')[0],
    schedule: {
      startTime: "10:00 AM",
      duration: 30
    },
    location: "New York",
    patientName: {
      firstName: "John",
      lastName: "Doe"
    },
    doctorName: {
      firstName: "Jane",
      lastName: "Smith"
    },
    status: "Scheduled"
  },
  {
    patientID: "123456",
    serviceName: "MRI Scan",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    schedule: {
      startTime: "11:30 AM",
      duration: 45
    },
    location: "Boston",
    patientName: {
      firstName: "John",
      lastName: "Doe"
    },
    doctorName: {
      firstName: "Michael",
      lastName: "Johnson"
    },
    status: "Scheduled"
  },
  {
    patientID: "123456",
    serviceName: "CT Scan",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    schedule: {
      startTime: "9:15 AM",
      duration: 60
    },
    location: "Chicago",
    patientName: {
      firstName: "John",
      lastName: "Doe"
    },
    doctorName: {
      firstName: "Sarah",
      lastName: "Brown"
    },
    status: "Completed"
  }
];

export async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoDBURI);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await Doctor.deleteMany({});
    console.log('Cleared existing doctor data');
    
    // Clear existing appointments
    await Appointment.deleteMany({});
    console.log('Cleared existing appointment data');

    // Insert sample data
    const doctorResult = await Doctor.insertMany(sampleDoctors);
    console.log(`Database seeded with ${doctorResult.length} doctors.`);
    
    // Insert sample appointments
    const appointmentResult = await Appointment.insertMany(sampleAppointments);
    console.log(`Database seeded with ${appointmentResult.length} appointments.`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection after seeding
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB after seeding');
  }
}

// If this script is run directly, execute seedDatabase
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  }).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}
