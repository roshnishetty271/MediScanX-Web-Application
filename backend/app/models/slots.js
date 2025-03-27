import mongoose from 'mongoose'

// Define the schema
const slotSchema = new mongoose.Schema({
  date: String, 
  locations: [{
    location: String,
    doctors: [{
      name: String,
      specialty: String,
      timeSlots: [String],
    }],
  }],
});

// Create a mongoose model using the schema
const Slot = mongoose.model('Slot', slotSchema);

module.exports = Slot;
