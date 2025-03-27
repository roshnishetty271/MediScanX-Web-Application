import express from 'express';
const router = express.Router();
import { generateBill } from '../controllers/bill-controller.js';
import * as billController from '../controllers/bill-controller.js';




router.post('/create-payment',billController.createPayment);

// router.post('/', generateBill); 
// router.post('/bills', billController.generateBill);

export default router;