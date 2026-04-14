import express from 'express';
import * as patientController from '../controllers/patientController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/patients
 * @desc    Get all patients (Admin)
 * @access  Private/Admin
 */
router.get('/', protect, authorize('admin'), patientController.getAllPatients);

/**
 * @route   GET /api/patients/stats/overview
 * @desc    Get patient statistics
 * @access  Private/Admin
 */
router.get('/stats/overview', protect, authorize('admin'), patientController.getPatientStats);

/**
 * @route   GET /api/patients/profile/me
 * @desc    Get current patient profile
 * @access  Private
 */
router.get('/profile/me', protect, authorize('patient'), patientController.getMyProfile);

/**
 * @route   GET /api/patients/:id
 * @desc    Get single patient by ID
 * @access  Private
 */
router.get('/:id', protect, patientController.getPatientById);

/**
 * @route   POST /api/patients
 * @desc    Create new patient
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), patientController.createPatient);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient information
 * @access  Private
 */
router.put('/:id', protect, patientController.updatePatient);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), patientController.deletePatient);

/**
 * @route   POST /api/patients/:id/medical-history
 * @desc    Add medical history to patient
 * @access  Private
 */
router.post('/:id/medical-history', protect, patientController.addMedicalHistory);

export default router;
