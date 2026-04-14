import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

/**
 * Get all doctors (for patient viewing)
 * @route GET /api/doctors
 * @access Public
 */
export const getAllDoctors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, specialization = '', search = '', sortBy = 'name' } = req.query;

    const searchQuery = { status: 'Active' };
    
    if (specialization) {
      searchQuery.specialization = specialization;
    }
    
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Doctor.countDocuments(searchQuery);

    const doctors = await Doctor.find(searchQuery)
      .select('-userId')
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single doctor by ID
 * @route GET /api/doctors/:id
 * @access Public
 */
export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-userId');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor profile (current logged-in doctor)
 * @route GET /api/doctors/profile/me
 * @access Private (Doctor)
 */
export const getMyProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctors by specialization
 * @route GET /api/doctors/specialization/:specialization
 * @access Public
 */
export const getDoctorsBySpecialization = async (req, res, next) => {
  try {
    const { specialization } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const total = await Doctor.countDocuments({ specialization, status: 'Active' });

    const doctors = await Doctor.find({ specialization, status: 'Active' })
      .select('-userId')
      .sort('name')
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
 * Create doctor profile (Admin)
 * @route POST /api/doctors
 * @access Private (Admin)
 */
export const createDoctor = async (req, res, next) => {
  try {
    const { userId, name, email, phone, licenseNumber, specialization, qualifications, experience, consultationFee, bio } = req.body;

    // Validate required fields
    if (!userId || !name || !email || !phone || !licenseNumber || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ licenseNumber });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor with this license number already exists'
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      userId,
      name,
      email,
      phone,
      licenseNumber,
      specialization,
      qualifications: qualifications || [],
      experience: experience || 0,
      consultationFee: consultationFee || 0,
      bio: bio || ''
    });

    res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor profile
 * @route PUT /api/doctors/:id
 * @access Private (Doctor/Admin)
 */
export const updateDoctor = async (req, res, next) => {
  try {
    const { name, phone, qualifications, experience, consultationFee, bio, availability, status } = req.body;

    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check authorization
    if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doctor'
      });
    }

    // Update fields
    if (name) doctor.name = name;
    if (phone) doctor.phone = phone;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (consultationFee) doctor.consultationFee = consultationFee;
    if (bio) doctor.bio = bio;
    if (availability) doctor.availability = availability;
    if (status && req.user.role === 'admin') doctor.status = status;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor's appointments
 * @route GET /api/doctors/:id/appointments
 * @access Private
 */
export const getDoctorAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;

    const searchQuery = { doctorId: req.params.id };
    if (status) {
      searchQuery.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Appointment.countDocuments(searchQuery);

    const appointments = await Appointment.find(searchQuery)
      .populate('patientId', 'name email phone')
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
 * Get doctor statistics
 * @route GET /api/doctors/stats/overview
 * @access Admin
 */
export const getDoctorStats = async (req, res, next) => {
  try {
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ status: 'Active' });
    const inactiveDoctors = await Doctor.countDocuments({ status: 'Inactive' });

    // Get specialization breakdown
    const specializations = await Doctor.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDoctors,
        activeDoctors,
        inactiveDoctors,
        specializations
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor availability
 * @route GET /api/doctors/:id/availability/:date
 * @access Public
 */
export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { id, date } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Get day of week
    const dateObj = new Date(date);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dateObj.getDay()];

    // Get booked slots for this date
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: date,
      status: { $in: ['pending', 'approved', 'completed'] }
    }).select('time');

    const bookedTimes = bookedAppointments.map(apt => apt.time);

    res.status(200).json({
      success: true,
      data: {
        dayOfWeek,
        doctorAvailability: doctor.availability?.[dayOfWeek] || null,
        bookedTimes,
        availableSlots: generateAvailableSlots(doctor.availability?.[dayOfWeek], bookedTimes)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper function to generate available time slots
 */
function generateAvailableSlots(availability, bookedTimes) {
  if (!availability || !availability.start || !availability.end) {
    return [];
  }

  const slots = [];
  const [startHour, startMin] = availability.start.split(':');
  const [endHour, endMin] = availability.end.split(':');

  let current = parseInt(startHour) * 60 + parseInt(startMin);
  const end = parseInt(endHour) * 60 + parseInt(endMin);
  const slotDuration = 30; // 30-minute slots

  while (current < end) {
    const hours = Math.floor(current / 60);
    const mins = current % 60;
    const timeSlot = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;

    if (!bookedTimes.includes(timeSlot)) {
      slots.push(timeSlot);
    }

    current += slotDuration;
  }

  return slots;
}

export default {
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  getDoctorsBySpecialization,
  createDoctor,
  updateDoctor,
  getDoctorAppointments,
  getDoctorStats,
  getDoctorAvailability
};
