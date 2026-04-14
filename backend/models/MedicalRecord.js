import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  // References
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },

  // Medical Information
  visitDate: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  prescription: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },

  // Treatment Details
  symptoms: {
    type: [String],
    default: []
  },
  tests: {
    type: [String],
    default: []
  },
  medications: {
    type: [String],
    default: []
  },

  // Follow-up
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: String,
    notes: String
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

// Indexes
medicalRecordSchema.index({ patientId: 1 });
medicalRecordSchema.index({ doctorId: 1 });
medicalRecordSchema.index({ appointmentId: 1 });
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });

export default mongoose.model('MedicalRecord', medicalRecordSchema);
