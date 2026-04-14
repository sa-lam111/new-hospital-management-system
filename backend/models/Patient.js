import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  // Link to User account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Personal Information
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },

  // Medical Information
  bloodType: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    default: 'Not Specified'
  },
  allergies: {
    type: [String],
    default: []
  },
  medicalHistory: {
    type: [String],
    default: []
  },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },

  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },

  // Patient ID (Unique identifier)
  patientId: {
    type: String,
    unique: true,
    sparse: true
  },

  // Status
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique Patient ID before saving
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    const randomNum = Math.floor(Math.random() * 10000);
    this.patientId = `PAT${Date.now()}${randomNum}`.slice(0, 20);
  }
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
patientSchema.index({ email: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ patientId: 1 });
patientSchema.index({ userId: 1 });

export default mongoose.model('Patient', patientSchema);
