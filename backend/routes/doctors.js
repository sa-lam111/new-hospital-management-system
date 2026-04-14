import express from 'express';
import * as doctorController from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/doctors
 * @desc    Get all active doctors
 * @access  Public
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @route   GET /api/doctors/stats/overview
 * @desc    Get doctor statistics
 * @access  Private/Admin
 */
router.get('/stats/overview', protect, authorize('admin'), doctorController.getDoctorStats);

/**
 * @route   GET /api/doctors/specialization/:specialization
 * @desc    Get doctors by specialization
 * @access  Public
 */
router.get('/specialization/:specialization', doctorController.getDoctorsBySpecialization);

/**
 * @route   GET /api/doctors/profile/me
 * @desc    Get current doctor profile
 * @access  Private (Doctor)
 */
router.get('/profile/me', protect, authorize('doctor'), doctorController.getMyProfile);

/**
 * @route   GET /api/doctors/:id
 * @desc    Get single doctor by ID
 * @access  Public
 */
router.get('/:id', doctorController.getDoctorById);

/**
 * @route   GET /api/doctors/:id/availability/:date
 * @desc    Get doctor availability for specific date
 * @access  Public
 */
router.get('/:id/availability/:date', doctorController.getDoctorAvailability);

/**
 * @route   GET /api/doctors/:id/appointments
 * @desc    Get doctor's appointments
 * @access  Private
 */
router.get('/:id/appointments', protect, doctorController.getDoctorAppointments);

/**
 * @route   POST /api/doctors
 * @desc    Create doctor profile (Admin)
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), doctorController.createDoctor);

/**
 * @route   PUT /api/doctors/:id
 * @desc    Update doctor profile
 * @access  Private (Doctor/Admin)
 */
router.put('/:id', protect, authorize('doctor', 'admin'), doctorController.updateDoctor);

export default router;
