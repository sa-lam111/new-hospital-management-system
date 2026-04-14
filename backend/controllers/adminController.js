import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import MedicalRecord from '../models/MedicalRecord.js';

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard
 * @access Admin
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get counts
    const totalPatients = await Patient.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalMedicalRecords = await MedicalRecord.countDocuments();

    // Get appointment status breakdown
    const appointmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get appointments by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const appointmentsByMonth = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get top specializations
    const topSpecializations = await Doctor.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name specialization')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalMedicalRecords,
        appointmentStats,
        appointmentsByMonth,
        topSpecializations,
        recentAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users (Admin view)
 * @route GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, userType = '', search = '' } = req.query;

    const searchQuery = {};
    if (userType) {
      searchQuery.userType = userType;
    }
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(searchQuery);

    const users = await User.find(searchQuery)
      .select('-password -emailVerificationToken -emailVerificationExpires')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all patients (Admin view with more details)
 * @route GET /api/admin/patients
 * @access Admin
 */
export const getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;

    const searchQuery = {};
    if (status) {
      searchQuery.status = status;
    }
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Patient.countDocuments(searchQuery);

    const patients = await Patient.find(searchQuery)
      .populate('userId', 'email phone createdAt')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      pages: Math.ceil(total / limit),
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all doctors (Admin view with more details)
 * @route GET /api/admin/doctors
 * @access Admin
 */
export const getAllDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '', specialization = '' } = req.query;

    const searchQuery = {};
    if (status) {
      searchQuery.status = status;
    }
    if (specialization) {
      searchQuery.specialization = specialization;
    }

    const skip = (page - 1) * limit;
    const total = await Doctor.countDocuments(searchQuery);

    const doctors = await Doctor.find(searchQuery)
      .populate('userId', 'email createdAt')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      pages: Math.ceil(total / limit),
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all appointments (Admin view with filters)
 * @route GET /api/admin/appointments
 * @access Admin
 */
export const getAllAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '', dateFrom = '', dateTo = '' } = req.query;

    const searchQuery = {};
    if (status) {
      searchQuery.status = status;
    }
    if (dateFrom || dateTo) {
      searchQuery.date = {};
      if (dateFrom) searchQuery.date.$gte = dateFrom;
      if (dateTo) searchQuery.date.$lte = dateTo;
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(searchQuery);

    const appointments = await Appointment.find(searchQuery)
      .populate('patientId', 'name email phone')
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
 * Get patient medical records
 * @route GET /api/admin/patients/:patientId/medical-records
 * @access Admin
 */
export const getPatientMedicalRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await MedicalRecord.countDocuments({ patientId: req.params.patientId });

    const records = await MedicalRecord.find({ patientId: req.params.patientId })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: records.length,
      total,
      pages: Math.ceil(total / limit),
      data: records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin)
 * @route DELETE /api/admin/users/:id
 * @access Admin
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate report (Admin)
 * @route GET /api/admin/reports/:type
 * @access Admin
 */
export const generateReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { dateFrom = '', dateTo = '' } = req.query;

    const dateQuery = {};
    if (dateFrom) dateQuery.$gte = new Date(dateFrom);
    if (dateTo) dateQuery.$lte = new Date(dateTo);

    let report = {};

    if (type === 'appointments') {
      report = await Appointment.aggregate([
        {
          $match: dateQuery ? { createdAt: dateQuery } : {}
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
    } else if (type === 'patients') {
      report = await Patient.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
    } else if (type === 'doctors') {
      report = await Doctor.aggregate([
        {
          $group: {
            _id: '$specialization',
            count: { $sum: 1 }
          }
        }
      ]);
    }

    res.status(200).json({
      success: true,
      reportType: type,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardStats,
  getAllUsers,
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getPatientMedicalRecords,
  deleteUser,
  generateReport
};
