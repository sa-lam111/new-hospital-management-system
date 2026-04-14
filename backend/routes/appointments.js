import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments (Admin)
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), appointmentController.getAllAppointments);

/**
 * @route   GET /api/appointments/stats/overview
 * @desc    Get appointment statistics
 * @access  Private/Admin
 */
router.get('/stats/overview', protect, authorize('admin'), appointmentController.getAppointmentStats);

/**
 * @route   GET /api/appointments/patient/:patientId
 * @desc    Get patient's appointments
 * @access  Private
 */
router.get('/patient/:patientId', protect, appointmentController.getPatientAppointments);

/**
 * @route   GET /api/appointments/doctor/:doctorId
 * @desc    Get doctor's appointments
 * @access  Private
 */
router.get('/doctor/:doctorId', protect, appointmentController.getDoctorAppointments);

/**
 * @route   GET /api/appointments/:id
 * @desc    Get single appointment by ID
 * @access  Private
 */
router.get('/:id', protect, appointmentController.getAppointmentById);

/**
 * @route   POST /api/appointments/book
 * @desc    Book new appointment
 * @access  Private (Patient)
 */
router.post('/book', protect, authorize('patient'), appointmentController.bookAppointment);

/**
 * @route   PUT /api/appointments/:id/status
 * @desc    Update appointment status (Doctor/Admin)
 * @access  Private (Doctor/Admin)
 */
router.put('/:id/status', protect, authorize('doctor', 'admin'), appointmentController.updateAppointmentStatus);

/**
 * @route   POST /api/appointments/:id/medical-notes
 * @desc    Add medical notes to appointment (Doctor)
 * @access  Private (Doctor)
 */
router.post('/:id/medical-notes', protect, authorize('doctor'), appointmentController.addMedicalNotes);

/**
 * @route   PUT /api/appointments/:id/reschedule
 * @desc    Reschedule appointment (Patient)
 * @access  Private (Patient)
 */
router.put('/:id/reschedule', protect, authorize('patient'), appointmentController.rescheduleAppointment);

/**
 * @route   PUT /api/appointments/:id/cancel
 * @desc    Cancel appointment
 * @access  Private
 */
router.put('/:id/cancel', protect, appointmentController.cancelAppointment);

export default router;
