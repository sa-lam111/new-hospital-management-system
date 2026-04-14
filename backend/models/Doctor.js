import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide doctor email'],
    unique: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number']
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
    enum: [
      'Cardiology',
      'Neurology',
      'Orthopedics',
      'Gynecology',
      'Dermatology',
      'Pediatrics',
      'General Practice',
      'Psychiatry',
      'Oncology',
      'Urology',
      'ENT',
      'Ophthalmology'
    ]
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  experience: {
    type: Number,
    default: 0
  },
  hospital: {
    type: String,
    default: 'Main Hospital'
  },
  availableDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  consultationFee: {
    type: Number,
    default: 100
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for specialization since we'll query by it
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isActive: 1 });

export default mongoose.model('Doctor', doctorSchema);
