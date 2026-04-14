import React from 'react';
import { motion } from 'framer-motion';
import { services } from '../data/doctor';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../api/services/index.js';
import { logError, getUserErrorMessage } from '../utils/errorHandler.js';
import { isDateTimeInPast } from '../utils/validation.js';

const PatientHomepage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  const patient = {
    name: user?.name || 'Patient',
    email: user?.email || 'patient@hospital.com',
    memberSince: user?.createdAt || '2022-01-15',
    profilePicture: user?.profilePicture || 'https://tse3.mm.bing.net/th/id/OIP.pwqclO0wa23CEQ6LXm-BZAHaE7?rs=1&pid=ImgDetMain&o=7&rm=3',
  };

  // Mock data (will be replaced with API calls)
  const medicalRecords = [
    { id: 1, title: 'Annual Check-up', date: '2023-07-20', summary: 'Overall health is good. Recommended to continue a healthy lifestyle.' },
    { id: 2, title: 'Blood Test Results', date: '2023-07-22', summary: 'All markers within normal range.' },
  ];

  const messages = [
    { id: 1, from: 'Dr. Sarah Johnson', content: 'Your test results are ready.', date: '2024-08-10' },
    { id: 2, from: 'Hospital Admin', content: 'Your appointment has been confirmed.', date: '2024-08-09' },
  ];

  const bills = [
    { id: 1, description: 'Consultation Fee', amount: '₦50,000', status: 'Paid', date: '2024-07-15' },
    { id: 2, description: 'Blood Test', amount: '₦3,000', status: 'Unpaid', date: '2024-07-20' },
  ];

  const emergencyContacts = [
    { id: 1, name: 'Emergency Services', phone: '911' },
    { id: 2, name: 'Hospital Helpline', phone: '+234 813 456 7890' },
  ];

  const insurance = {
    provider: 'Family Plan',
    policyNumber: 'HP-123456789',
    validTill: '2025-12-31',
  };

  const prescriptions = [
    { id: 1, medication: 'Amoxicillin', refillAvailable: true },
    { id: 2, medication: 'Paracetamol', refillAvailable: true },
    { id: 3, medication: 'Ibuprofen', refillAvailable: false },
    { id: 4, medication: 'Metformin', refillAvailable: true },
    { id: 5, medication: 'Lisinopril', refillAvailable: false },
  ];

  const [showBookModal, setShowBookModal] = React.useState(false);
  const [bookForm, setBookForm] = React.useState({
    name: patient.name,
    email: patient.email,
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });
  const [bookSubmitted, setBookSubmitted] = React.useState(false);
  const [refillRequested, setRefillRequested] = React.useState([]);
  const [paidBills, setPaidBills] = React.useState([]);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [currentBill, setCurrentBill] = React.useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);
  const [newDate, setNewDate] = React.useState('');
  const [newTime, setNewTime] = React.useState('');
  const [appointmentsState, setAppointmentsState] = React.useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(true);
  const [appointmentsError, setAppointmentsError] = React.useState(null);
  const [notification, setNotification] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch appointments on component mount
  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        setAppointmentsError(null);
        const result = await appointmentService.getMyAppointments();
        
        if (result.success) {
          setAppointmentsState(result.data || []);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        logError('fetchAppointments', error);
        setAppointmentsError(getUserErrorMessage(error));
        setNotification(`❌ ${getUserErrorMessage(error)}`);
        setAppointmentsState([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleBookChange = (e) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!bookForm.name || !bookForm.email || !bookForm.phone || !bookForm.service || !bookForm.date || !bookForm.time) {
      setNotification('❌ Please fill in all required fields.');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookForm.email)) {
      setNotification('❌ Please enter a valid email address.');
      return;
    }
    
    // Validate phone format (basic)
    if (bookForm.phone.length < 7) {
      setNotification('❌ Please enter a valid phone number.');
      return;
    }
    
    // Validate date is not in the past
    if (isDateTimeInPast(bookForm.date, bookForm.time)) {
      setNotification('❌ Appointment date and time cannot be in the past.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await appointmentService.bookAppointment({
        doctor: bookForm.service,
        date: bookForm.date,
        time: bookForm.time,
        reason: bookForm.message || 'Patient appointment request',
        phone: bookForm.phone,
      });
      
      if (result.success) {
        setBookSubmitted(true);
        setNotification('✅ Appointment booked successfully!');
        
        // Refresh appointments list
        const appointmentsResult = await appointmentService.getMyAppointments();
        if (appointmentsResult.success) {
          setAppointmentsState(appointmentsResult.data || []);
        }

        // Auto-close modal after 3 seconds
        setTimeout(() => {
          handleCloseBookModal();
          setNotification('');
        }, 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      logError('handleBookSubmit', error);
      setNotification(`❌ ${getUserErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenBookModal = () => {
    setShowBookModal(true);
    setBookSubmitted(false);
    setBookForm({
      name: patient.name,
      email: patient.email,
      phone: '',
      service: '',
      date: '',
      time: '',
      message: '',
    });
  };

  const handleCloseBookModal = () => {
    // Warn if form has unsaved data
    if (!bookSubmitted && (bookForm.phone || bookForm.service || bookForm.date || bookForm.time || bookForm.message)) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    setShowBookModal(false);
  };

  // Function to handle video call with error handling
  const handleStartVideoCall = () => {
    try {
      if (!patient.name) {
        setNotification('Unable to start video call. Please ensure your profile is complete.');
        return;
      }
      // Generate a unique room name using patient name and timestamp
      const roomName = `hospital-video-${patient.name.replace(/\s+/g, '')}-${Date.now()}`;
      const url = `https://meet.jit.si/${roomName}`;
      window.open(url, '_blank');
      setNotification('Video call window opened. Please wait for the doctor to join.');
      setTimeout(() => setNotification(''), 4000);
    } catch (error) {
      console.error('Error starting video call:', error);
      setNotification('Failed to start video call. Please try again.');
    }
  };

  const handleRequestRefill = (rxId) => {
    setRefillRequested(prev => [...prev, rxId]);
    setNotification('✅ Prescription refill requested!');
    setTimeout(() => {
      setRefillRequested(prev => prev.filter(id => id !== rxId));
      setNotification('');
    }, 3000);
  };

  const handlePayNow = (bill) => {
    setCurrentBill(bill);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setPaidBills(prev => [...prev, currentBill.id]);
      setShowPaymentModal(false);
      setCurrentBill(null);
      setNotification(`✅ Payment of ${currentBill.amount} successful!`);
      setIsSubmitting(false);
      setTimeout(() => setNotification(''), 3000);
    }, 1500);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentBill(null);
  };

  const handleOpenReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setShowRescheduleModal(true);
  };

  const handleCloseReschedule = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDate('');
    setNewTime('');
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    // Validation: date must not be in the past, time must not be empty
    if (!newDate || !newTime) {
      setNotification('❌ Please select both a new date and time.');
      return;
    }
    if (isDateTimeInPast(newDate, newTime)) {
      setNotification('❌ The new appointment date and time cannot be in the past.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await appointmentService.rescheduleAppointment(selectedAppointment.id, {
        date: newDate,
        time: newTime,
      });
      
      if (result.success) {
        setAppointmentsState(prev => prev.map(app =>
          app.id === selectedAppointment.id ? { ...app, date: newDate, time: newTime } : app
        ));
        setNotification('✅ Appointment rescheduled successfully!');
        handleCloseReschedule();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      logError('handleRescheduleSubmit', error);
      setNotification(`❌ ${getUserErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <motion.div className="bg-gray-100 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="container mx-auto px-4 py-12">
        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-blue-100 border-l-4 border-indigo-600 text-indigo-800 rounded shadow text-center animate-fade-in">
            {notification}
          </div>
        )}
        {/* Patient Profile Section */}
        <motion.section className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex items-center gap-8" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <img
            src={patient.profilePicture}
            alt="Patient"
            className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
          />
          <div>
            <h1 className="text-4xl font-bold text-primary">{patient.name}</h1>
            <p className="text-gray-600 text-lg">{patient.email}</p>
            <p className="text-gray-500">Insurance Plan: {insurance.provider}</p>
          </div>
        </motion.section>

        {/* Appointments Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-primary mb-6">Your Upcoming Appointments</h2>
          {appointmentsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Loading appointments...</p>
            </div>
          ) : appointmentsState.length === 0 ? (
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
              <p className="text-blue-800">No appointments scheduled. <button onClick={handleOpenBookModal} className="font-bold underline">Book one now!</button></p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {appointmentsState.map((appointment, idx) => (
                <motion.div
                  key={appointment.id || idx}
                  className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800">{appointment.specialization || appointment.department}</h3>
                  <p className="text-gray-600">with {appointment.doctor}</p>
                  <p className="text-gray-800 font-semibold mt-4">{appointment.date} at {appointment.time}</p>
                  <button 
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors" 
                    onClick={() => handleOpenReschedule(appointment)}
                    aria-label={`Reschedule appointment with ${appointment.doctor}`}
                  >
                    Reschedule
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-labelledby="reschedule-title">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button 
                onClick={handleCloseReschedule} 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                aria-label="Close reschedule dialog"
              >
                &times;
              </button>
              <h2 id="reschedule-title" className="text-2xl font-bold text-indigo-700 mb-4 text-center">Reschedule Appointment</h2>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">New Date</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">New Time</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCloseReschedule} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {/* Medical Records Section */}
        <motion.section initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-primary mb-6">Your Medical Records</h2>
          <motion.div className="bg-white rounded-xl shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <ul className="divide-y divide-gray-200">
              {medicalRecords.map((record, idx) => (
                <motion.li
                  key={record.id}
                  className="p-6 hover:bg-gray-50"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-gray-800">{record.title}</h3>
                  <p className="text-gray-500 mb-2">Date: {record.date}</p>
                  <p className="text-gray-700">{record.summary}</p>
                  <button className="text-indigo-600 font-semibold mt-2 inline-block hover:text-indigo-700 hover:underline transition-colors">View Details</button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* Book Appointment Button */}
        <div className="flex justify-end mb-8">
          <button 
            onClick={handleOpenBookModal} 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
            aria-label="Book a new appointment"
          >
            + Book New Appointment
          </button>
        </div>

        {/* Book Appointment Modal */}
        {showBookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-labelledby="booking-title">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
              <button 
                onClick={handleCloseBookModal} 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                aria-label="Close booking dialog"
              >
                &times;
              </button>
              {!bookSubmitted ? (
                <>
                  <h2 id="booking-title" className="text-2xl font-bold text-primary mb-4 text-center">Book an Appointment</h2>
                  <form onSubmit={handleBookSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input type="text" name="name" value={bookForm.name} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={bookForm.email} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone</label>
                      <input type="tel" name="phone" value={bookForm.phone} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Service</label>
                      <select name="service" value={bookForm.service} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary">
                        <option value="">Select a service</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Date</label>
                        <input type="date" name="date" value={bookForm.date} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-gray-700 mb-1">Time</label>
                        <input type="time" name="time" value={bookForm.time} onChange={handleBookChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Message (optional)</label>
                      <textarea name="message" value={bookForm.message} onChange={handleBookChange} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" rows={3} />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Booking...' : 'Book Appointment'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-4">Appointment Booked!</h2>
                  <p className="text-gray-700 mb-2">Thank you, {bookForm.name}. Your appointment for <span className="font-semibold">{bookForm.service}</span> on <span className="font-semibold">{bookForm.date}</span> at <span className="font-semibold">{bookForm.time}</span> has been received.</p>
                  <p className="text-gray-500">We will contact you soon for confirmation.</p>
                  <button onClick={handleCloseBookModal} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages/Notifications Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Messages & Notifications</h2>
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
            {messages.map(msg => (
              <li key={msg.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <span className="font-semibold">{msg.from}:</span> {msg.content}
                </div>
                <span className="text-gray-400 text-sm">{msg.date}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Billing & Payments Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Billing & Payments</h2>
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
            {bills.map(bill => (
              <li key={bill.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <span className="font-semibold">{bill.description}</span> - {bill.amount}
                  <span className={`ml-4 px-2 py-1 rounded text-xs ${paidBills.includes(bill.id) || bill.status === 'Paid' ? 'bg-blue-100 text-indigo-700' : 'bg-red-100 text-red-700'}`}>{paidBills.includes(bill.id) || bill.status === 'Paid' ? 'Paid' : 'Unpaid'}</span>
                </div>
                <span className="text-gray-400 text-sm">{bill.date}</span>
                {!(paidBills.includes(bill.id) || bill.status === 'Paid') && (
                  <button 
                    className="ml-4 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors" 
                    onClick={() => handlePayNow(bill)}
                    aria-label={`Pay ${bill.amount} for ${bill.description}`}
                  >
                    Pay Now
                  </button>
                )}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Payment Modal */}
        {showPaymentModal && currentBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-labelledby="payment-title">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button 
                onClick={handleClosePaymentModal} 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                aria-label="Close payment dialog"
              >
                &times;
              </button>
              <h2 id="payment-title" className="text-2xl font-bold text-indigo-700 mb-4 text-center">Confirm Payment</h2>
              <p className="mb-4 text-center">Are you sure you want to pay <span className="font-semibold">{currentBill.amount}</span> for <span className="font-semibold">{currentBill.description}</span>?</p>
              <button 
                onClick={handleConfirmPayment} 
                disabled={isSubmitting}
                className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
              >
                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              </button>
              <button onClick={handleClosePaymentModal} className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold">Cancel</button>
            </div>
          </div>
        )}

        {/* Emergency Contacts Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.24, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Emergency Contacts</h2>
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
            {emergencyContacts.map(contact => (
              <li key={contact.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span>{contact.name}</span>
                <a 
                  href={`tel:${contact.phone}`} 
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                  aria-label={`Call ${contact.name} at ${contact.phone}`}
                >
                  ☎️ {contact.phone}
                </a>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Insurance Information Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.27, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Insurance Information</h2>
          <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            <p className="mb-2"><span className="font-semibold">Provider:</span> {insurance.provider}</p>
            <p className="mb-2"><span className="font-semibold">Policy Number:</span> {insurance.policyNumber}</p>
            <p><span className="font-semibold">Valid Till:</span> {insurance.validTill}</p>
          </div>
        </motion.section>

        {/* Prescription Refills Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Prescription Refills</h2>
          <ul className="bg-white rounded-xl shadow-md divide-y divide-gray-200">
            {prescriptions.map(rx => (
              <li key={rx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <span>{rx.medication}</span>
                {rx.refillAvailable ? (
                  refillRequested.includes(rx.id) ? (
                    <span className="text-indigo-600 font-semibold">✓ Refill Requested!</span>
                  ) : (
                    <button 
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors" 
                      onClick={() => handleRequestRefill(rx.id)}
                      aria-label={`Request refill for ${rx.medication}`}
                    >
                      Request Refill
                    </button>
                  )
                ) : (
                  <span className="text-gray-400">No refills left</span>
                )}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Telemedicine/Video Consultation Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.33, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Telemedicine / Video Consultation</h2>
          <div className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row items-center gap-4">
            <p className="flex-1">Need to consult a doctor online? Start a secure video call with our specialists.</p>
            <button 
              onClick={handleStartVideoCall} 
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              aria-label="Start a video consultation"
            >
              📹 Start Video Call
            </button>
          </div>
        </motion.section>

        {/* Feedback/Support Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.36, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Feedback & Support</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            <p>Have feedback or need help? <button className="text-blue-600 hover:text-blue-700 underline">Contact Support</button></p>
          </div>
        </motion.section>

        {/* Settings Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.39, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Settings</h2>
          <div className="bg-white rounded-xl shadow-md p-4">
            <button 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-4 hover:bg-gray-300 transition-colors"
              aria-label="Update your profile"
            >
              Update Profile
            </button>
            <button 
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-4 hover:bg-gray-300 transition-colors"
              aria-label="Change your password"
            >
              Change Password
            </button>
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Logout from your account"
            >
              Logout
            </button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PatientHomepage; 