import Patient from '../models/Patient.js';
import User from '../models/User.js';

/**
 * Get all patients
 * @route GET /api/patients
 * @access Admin
 */
export const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = '-createdAt' } = req.query;

    // Build search query
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Patient.countDocuments(searchQuery);

    // Get patients with pagination
    const patients = await Patient.find(searchQuery)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single patient by ID
 * @route GET /api/patients/:id
 * @access Private
 */
export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged-in patient profile
 * @route GET /api/patients/profile/me
 * @access Private (Patient)
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new patient (Admin or after user registration)
 * @route POST /api/patients
 * @access Private/Admin
 */
export const createPatient = async (req, res, next) => {
  try {
    const { name, email, phone, age, gender, bloodType, allergies, medicalHistory, address, emergencyContact, userId } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !age || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    // Create patient
    const patient = await Patient.create({
      name,
      email,
      phone,
      age,
      gender,
      bloodType: bloodType || 'Not Specified',
      allergies: allergies || [],
      medicalHistory: medicalHistory || [],
      address: address || {},
      emergencyContact: emergencyContact || {},
      userId: userId || req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update patient information
 * @route PUT /api/patients/:id
 * @access Private
 */
export const updatePatient = async (req, res, next) => {
  try {
    const { name, email, phone, age, gender, bloodType, allergies, medicalHistory, address, emergencyContact, status } = req.body;

    // Find patient
    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Check authorization - user can only update their own profile
    if (patient.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this patient'
      });
    }

    // Update allowed fields
    if (name) patient.name = name;
    if (phone) patient.phone = phone;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    if (bloodType) patient.bloodType = bloodType;
    if (allergies) patient.allergies = allergies;
    if (medicalHistory) patient.medicalHistory = medicalHistory;
    if (address) patient.address = { ...patient.address, ...address };
    if (emergencyContact) patient.emergencyContact = emergencyContact;
    if (status && req.user.role === 'admin') patient.status = status;

    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete patient
 * @route DELETE /api/patients/:id
 * @access Admin
 */
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Optionally delete associated user account
    // await User.findByIdAndDelete(patient.userId);

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get patient statistics
 * @route GET /api/patients/stats/overview
 * @access Admin
 */
export const getPatientStats = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ status: 'Active' });
    const inactivePatients = await Patient.countDocuments({ status: 'Inactive' });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        inactivePatients
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add medical history to patient
 * @route POST /api/patients/:id/medical-history
 * @access Private
 */
export const addMedicalHistory = async (req, res, next) => {
  try {
    const { condition } = req.body;

    if (!condition) {
      return res.status(400).json({
        success: false,
        message: 'Please provide medical condition'
      });
    }

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    if (!patient.medicalHistory.includes(condition)) {
      patient.medicalHistory.push(condition);
      await patient.save();
    }

    res.status(200).json({
      success: true,
      message: 'Medical history updated',
      data: patient
    });
  } catch (error) {
    next(error);
  }
};
