import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    format: 'float',
  },
  description: {
    type: String,
    required: true,
  },
 
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
