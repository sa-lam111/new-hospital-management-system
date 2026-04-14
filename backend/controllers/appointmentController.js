import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import MedicalRecord from '../models/MedicalRecord.js';

/**
 * Get all appointments (Admin)
 * @route GET /api/appointments
 * @access Admin
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '', sortBy = '-createdAt' } = req.query;

    const searchQuery = {};
    if (status) {
      searchQuery.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(searchQuery);

    const appointments = await Appointment.find(searchQuery)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient's appointments
 * @route GET /api/appointments/patient/:patientId
 * @access Private (Patient)
 */
export const getPatientAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const searchQuery = { patientId: req.params.patientId };
    if (status) {
      searchQuery.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(searchQuery);

    const appointments = await Appointment.find(searchQuery)
      .populate('doctorId', 'name specialization')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor's appointments
 * @route GET /api/appointments/doctor/:doctorId
 * @access Private (Doctor)
 */
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const searchQuery = { doctorId: req.params.doctorId };
    if (status) {
      searchQuery.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(searchQuery);

    const appointments = await Appointment.find(searchQuery)
      .populate('patientId', 'name email phone')
      .sort('-date')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single appointment
 * @route GET /api/appointments/:id
 * @access Private
 */
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Book appointment
 * @route POST /api/appointments/book
 * @access Private (Patient)
 */
export const bookAppointment = async (req, res, next) => {
  try {
    const { patientId, doctorId, date, time, reason, message } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This appointment slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phone,
      doctorId,
      doctorName: doctor.name,
      specialization: doctor.specialization,
      date,
      time,
      reason,
      message: message || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update appointment status (Doctor/Admin)
 * @route PUT /api/appointments/:id/status
 * @access Private (Doctor/Admin)
 */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status'
      });
    }

    const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('patientId patientName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Appointment marked as ${status}`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add medical notes to completed appointment (Doctor)
 * @route POST /api/appointments/:id/medical-notes
 * @access Private (Doctor)
 */
export const addMedicalNotes = async (req, res, next) => {
  try {
    const { diagnosis, prescription, notes } = req.body;

    if (!diagnosis || !prescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide diagnosis and prescription'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only add notes to completed appointments'
      });
    }

    // Update appointment with medical notes
    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription;
    appointment.notes = notes || '';
    await appointment.save();

    // Create medical record
    const medicalRecord = await MedicalRecord.create({
      patientId: appointment.patientId,
      doctorId: req.user.id,
      appointmentId: appointment._id,
      visitDate: appointment.date,
      diagnosis,
      prescription,
      notes: notes || ''
    });

    res.status(200).json({
      success: true,
      message: 'Medical notes added successfully',
      data: {
        appointment,
        medicalRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reschedule appointment (Patient)
 * @route PUT /api/appointments/:id/reschedule
 * @access Private (Patient)
 */
export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new date and time'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Can only reschedule pending or approved appointments
    if (!['pending', 'approved'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule this appointment'
      });
    }

    // Check if new slot is available
    const conflictingAppointment = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date,
      time,
      _id: { $ne: req.params.id },
      status: { $in: ['pending', 'approved', 'completed'] }
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    appointment.date = date;
    appointment.time = time;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment
 * @route PUT /api/appointments/:id/cancel
 * @access Private
 */
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed appointment'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get appointment statistics
 * @route GET /api/appointments/stats/overview
 * @access Admin
 */
export const getAppointmentStats = async (req, res, next) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const approved = await Appointment.countDocuments({ status: 'approved' });
    const completed = await Appointment.countDocuments({ status: 'completed' });
    const cancelled = await Appointment.countDocuments({ status: 'cancelled' });

    res.status(200).json({
      success: true,
      data: {
        totalAppointments,
        pending,
        approved,
        completed,
        cancelled
      }
    });
  } catch (error) {
    next(error);
  }
};
