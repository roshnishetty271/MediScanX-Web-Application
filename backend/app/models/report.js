import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const PatientReportSchema = new Schema({
    patientID: {

        type: String,
        required: true
    },
   
    date: {    
        
        type: String,
        required: true
    },
    time: {    
        
        type: String,
        required: true
    },
    symptoms: {    
        
        type: String,
        required: true
    },
    reporttime: {    
        
        type: String,
        required: true
    },
    findings: {    
        
        type: String,
        required: true
    },  
    doctorName: {
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String
        }   
    }

},
)

const ReportModel = mongoose.model('report', PatientReportSchema)
export default ReportModel