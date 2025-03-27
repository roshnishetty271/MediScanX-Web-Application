import appointmentRouter from './appointment-route.js'
import reportRouter from './report-route.js'
import patientRoutes from './patient-routes.js';
import doctorRoutes from './doctor-routes.js';
import billRoutes from './bill-routes.js';


export default (app) => {
    app.use('/appointment', appointmentRouter)
    app.use('/reports', reportRouter)
    app.use('/patients', patientRoutes);
    app.use('/doctors', doctorRoutes);
    app.use('/api/bills', billRoutes);
}