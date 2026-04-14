import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * @route   GET /api/admin/patients
 * @desc    Get all patients
 * @access  Private/Admin
 */
router.get('/patients', adminController.getAllPatients);

/**
 * @route   GET /api/admin/patients/:patientId/medical-records
 * @desc    Get patient's medical records
 * @access  Private/Admin
 */
router.get('/patients/:patientId/medical-records', adminController.getPatientMedicalRecords);

/**
 * @route   GET /api/admin/doctors
 * @desc    Get all doctors
 * @access  Private/Admin
 */
router.get('/doctors', adminController.getAllDoctors);

/**
 * @route   GET /api/admin/appointments
 * @desc    Get all appointments
 * @access  Private/Admin
 */
router.get('/appointments', adminController.getAllAppointments);

/**
 * @route   GET /api/admin/reports/:type
 * @desc    Generate reports
 * @access  Private/Admin
 */
router.get('/reports/:type', adminController.generateReport);

export default router;
