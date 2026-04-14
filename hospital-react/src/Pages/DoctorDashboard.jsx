import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const doctor = {
    name: user?.name || 'Dr. Doctor',
    email: user?.email || 'doctor@hospital.com',
    specialty: user?.specialty || 'General Medicine',
    memberSince: user?.createdAt || '2015-03-10',
    profilePicture: user?.profilePicture || 'https://images.pexels.com/photos/1181696/pexels-photo-1181696.jpeg',
  }; 

  const initialAppointments = [
    { id: 1, patient: 'Ngozi Okafor', time: '10:00 AM', date: '2026-01-15', reason: 'Check-up', status: 'Upcoming', notes: '', completed: false, noShow: false },
    { id: 2, patient: 'Emeka Adeyemi', time: '11:30 AM', date: '2026-01-15', reason: 'Follow-up', status: 'Upcoming', notes: '', completed: false, noShow: false },
  ];

  const initialPatients = [
    { id: 1, name: 'Ngozi Okafor', lastVisit: '2025-07-20', history: ['2024-07-20: Check-up', '2024-06-10: Blood Test'], records: ['Blood Test.pdf'], prescriptions: ['Atorvastatin'] },
    { id: 2, name: 'Emeka Adeyemi', lastVisit: '2025-07-15', history: ['2024-07-15: Follow-up'], records: ['ECG.pdf'], prescriptions: ['Metformin'] },
  ];

  const messages = [
    { id: 1, from: 'Admin', content: 'Please update your profile.', date: '2024-08-10' },
    { id: 2, from: 'Ngozi Okafor', content: 'Thank you for the consultation!', date: '2024-08-09' },
  ];
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : initialPatients;
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '', reason: '' });
  const [rescheduleSubmitted, setRescheduleSubmitted] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ name: '', lastVisit: '', history: [], records: [], prescriptions: [] });
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availability, setAvailability] = useState('10:00 AM - 5:00 PM');
  const [availabilityForm, setAvailabilityForm] = useState(availability);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [profilePic, setProfilePic] = useState(doctor.profilePicture);
  // Analytics mock
  const patientsSeen = 28;
  const appointmentTrends = [1, 3, 5, 4, 6, 2, 7]; // mock data for chart
  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  // Save patients to localStorage whenever it changes
  useEffect(() => {
    // Replace old names if they exist in localStorage
    const updatedPatients = patients.map(p => {
      if (p.name === 'Jane Smith') return { ...p, name: 'Ngozi Okafor' };
      if (p.name === 'John Doe') return { ...p, name: 'Emeka Adeyemi' };
      return p;
    });
    if (JSON.stringify(updatedPatients) !== JSON.stringify(patients)) {
      setPatients(updatedPatients);
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
    } else {
      localStorage.setItem('patients', JSON.stringify(patients));
    }
  }, [patients]);

  // Appointment actions
  const handleMarkCompleted = (id) => setAppointments(appts => appts.map(a => a.id === id ? { ...a, completed: true, noShow: false } : a));
  const handleMarkNoShow = (id) => setAppointments(appts => appts.map(a => a.id === id ? { ...a, noShow: true, completed: false } : a));
  const handleNoteChange = (id, note) => setAppointments(appts => appts.map(a => a.id === id ? { ...a, notes: note } : a));

  // Patient modal
  const handleOpenPatientModal = (patient) => { setSelectedPatient(patient); setShowPatientModal(true); };
  const handleClosePatientModal = () => { setShowPatientModal(false); setSelectedPatient(null); };

  // Add patient
  const handleAddPatient = (e) => { e.preventDefault(); setPatients([...patients, { ...newPatientForm, id: Date.now() }]); setShowAddPatientModal(false); setNewPatientForm({ name: '', lastVisit: '', history: [], records: [], prescriptions: [] }); };

  // Remove patient
  const handleRemovePatient = (id) => {
    setPatients(patients => patients.filter(p => p.id !== id));
    if (selectedPatient && selectedPatient.id === id) {
      setShowPatientModal(false);
      setSelectedPatient(null);
    }
  };

  // Availability
  const handleOpenAvailability = () => { setAvailabilityForm(availability); setShowAvailabilityModal(true); };
  const handleSaveAvailability = (e) => { e.preventDefault(); setAvailability(availabilityForm); setShowAvailabilityModal(false); };

  // Profile photo upload (mock)
  const handleProfilePicChange = (e) => { if (e.target.files && e.target.files[0]) { setProfilePic(URL.createObjectURL(e.target.files[0])); } };

  const handleOpenReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
    setRescheduleForm({ date: '', time: '', reason: '' });
    setRescheduleSubmitted(false);
  };

  const handleCloseReschedule = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setRescheduleForm({ date: '', time: '', reason: '' });
    setRescheduleSubmitted(false);
  };

  const handleRescheduleChange = (e) => {
    setRescheduleForm({ ...rescheduleForm, [e.target.name]: e.target.value });
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    // Update the appointment in the appointments array
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === selectedAppointment.id
          ? { ...appt, date: rescheduleForm.date, time: rescheduleForm.time }
          : appt
      )
    );
    setRescheduleSubmitted(true);
  };

  return (
    <motion.div className="bg-gray-100 min-h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-6">
          <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">Logout</button>
        </div>
        {/* Doctor Profile Section */}
        <motion.section className="bg-white rounded-2xl shadow-lg p-8 mb-12 flex items-center gap-8" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <img
            src={profilePic}
            alt="Doctor"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
          />
          <div>
            <h1 className="text-4xl font-bold text-primary">{doctor.name}</h1>
            <p className="text-gray-600 text-lg">{doctor.email}</p>
            <p className="text-gray-500">Specialty: {doctor.specialty}</p>
            <p className="text-gray-400">Member Since: {doctor.memberSince}</p>
            <div className="mt-4 flex gap-4 items-center">
              <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer hover:bg-gray-300">
                <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                Change Photo
              </label>
            </div>
          </div>
        </motion.section>
        {/* Analytics & Insights Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Analytics & Insights</h2>
          <div className="flex gap-8 flex-wrap">
            <div className="bg-white rounded-xl shadow-md p-6 flex-1 min-w-[200px]">
              <div className="text-3xl font-bold">{patientsSeen}</div>
              <div>Patients seen this week</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 flex-1 min-w-[200px]">
              <div className="font-bold mb-2">Appointment Trends</div>
              <div className="flex gap-3 items-end h-32 relative">
                {appointmentTrends.map((v, i) => (
                  <div key={i} className="flex flex-col items-center w-8">
                    <span className="mb-1 text-xs font-semibold text-blue-700">{v}</span>
                    <div
                      className="w-6 transition-all duration-300 rounded-t-xl shadow-md bg-gradient-to-t from-blue-400 to-indigo-400"
                      style={{ height: `${v * 10 + 10}px` }}
                    ></div>
                    <span className="mt-2 text-xs text-gray-500">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2">Appointments per day (Mon-Sun)</div>
            </div>
          </div>
        </motion.section>

        {/* Add New Patient Button */}
        <div className="flex justify-end mb-8">
          <button onClick={() => setShowAddPatientModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Add New Patient
          </button>
        </div>

        {/* Today's Appointments Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-primary mb-6">Today's Appointments</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {appointments.filter(appointment => !appointment.completed).map((appointment, idx) => (
              <motion.div
                key={appointment.id}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${appointment.completed ? 'border-indigo-600' : appointment.noShow ? 'border-red-600' : 'border-blue-600'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800">{appointment.patient}</h3>
                <p className="text-gray-600">Reason: {appointment.reason}</p>
                <p className="text-gray-800 font-semibold mt-4">{appointment.date} at {appointment.time}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button onClick={() => handleOpenReschedule(appointment)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Reschedule</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">Cancel</button>
                  <button onClick={() => handleMarkCompleted(appointment.id)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Mark Completed</button>
                  <button onClick={() => handleMarkNoShow(appointment.id)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors">Mark No-show</button>
                </div>
                <div className="mt-4">
                  <label className="block text-gray-700 mb-1">Private Notes</label>
                  <textarea value={appointment.notes} onChange={e => handleNoteChange(appointment.id, e.target.value)} className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" rows={2} placeholder="Add notes..." />
                </div>
                {appointment.completed && <div className="mt-2 text-indigo-700 font-semibold">Completed</div>}
                {appointment.noShow && <div className="mt-2 text-yellow-700 font-semibold">No-show</div>}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Reschedule Modal */}
        {showRescheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={handleCloseReschedule} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              {!rescheduleSubmitted ? (
                <>
                  <h2 className="text-2xl font-bold text-primary mb-4 text-center">Reschedule Appointment</h2>
                  <p className="mb-4 text-center text-gray-700">{selectedAppointment && `For ${selectedAppointment.patient} (${selectedAppointment.date} at ${selectedAppointment.time})`}</p>
                  <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-1">New Date</label>
                      <input type="date" name="date" value={rescheduleForm.date} onChange={handleRescheduleChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">New Time</label>
                      <input type="time" name="time" value={rescheduleForm.time} onChange={handleRescheduleChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Reason for Rescheduling</label>
                      <textarea name="reason" value={rescheduleForm.reason} onChange={handleRescheduleChange} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" rows={3} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors">Confirm Reschedule</button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-indigo-700 mb-4">Appointment Rescheduled!</h2>
                  <p className="text-gray-700 mb-2">The appointment for <span className="font-semibold">{selectedAppointment.patient}</span> has been rescheduled to <span className="font-semibold">{rescheduleForm.date}</span> at <span className="font-semibold">{rescheduleForm.time}</span>.</p>
                  <p className="text-gray-700 mb-2">Reason: <span className="font-semibold">{rescheduleForm.reason}</span></p>
                  <button onClick={handleCloseReschedule} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Close</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Patient List Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-primary mb-6">My Patients</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {patients.map((patient, idx) => (
              <motion.div
                key={patient.id}
                className="bg-white rounded-xl shadow-md p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800">{patient.name}</h3>
                <p className="text-gray-500">Last Visit: {patient.lastVisit}</p>
                <div className="flex gap-2 mt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onClick={() => handleOpenPatientModal(patient)}>View Details</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors" onClick={() => handleRemovePatient(patient.id)}>Remove</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Patient Details Modal */}
        {showPatientModal && selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={handleClosePatientModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">{selectedPatient.name}</h2>
              <div className="mb-4">
                <div className="font-semibold mb-1">Medical History:</div>
                <ul className="list-disc ml-6 text-gray-700 mb-2">
                  {selectedPatient.history.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
                <div className="font-semibold mb-1">Records:</div>
                <ul className="list-disc ml-6 text-gray-700 mb-2">
                  {selectedPatient.records.map((r, i) => <li key={i}><a href="#" className="text-blue-600 underline">{r}</a></li>)}
                </ul>
                <div className="font-semibold mb-1">Prescriptions:</div>
                <ul className="list-disc ml-6 text-gray-700 mb-2">
                  {selectedPatient.prescriptions.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2">Write Prescription</button>
                <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Upload Record</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleRemovePatient(selectedPatient.id)}>Remove Patient</button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Patient Modal */}
        {showAddPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={() => setShowAddPatientModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">Add New Patient</h2>
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={newPatientForm.name} onChange={e => setNewPatientForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Visit</label>
                  <input type="date" value={newPatientForm.lastVisit} onChange={e => setNewPatientForm(f => ({ ...f, lastVisit: e.target.value }))} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors">Add Patient</button>
              </form>
            </div>
          </div>
        )}

        {/* Schedule Management Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Schedule Management</h2>
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">Current Availability: <span className="font-semibold">{availability}</span></div>
            <button onClick={handleOpenAvailability} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Edit Availability</button>
          </div>
        </motion.section>
        {showAvailabilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={() => setShowAvailabilityModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">Edit Availability</h2>
              <form onSubmit={handleSaveAvailability} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Available Hours</label>
                  <input type="text" value={availabilityForm} onChange={e => setAvailabilityForm(e.target.value)} required className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors">Save</button>
              </form>
            </div>
          </div>
        )}

        {/* Calendar View (Mock) */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.36, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Calendar View</h2>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-gray-700">[Calendar Placeholder: Upcoming appointments shown here]</div>
          </div>
        </motion.section>

        {/* Support & Feedback Section */}
        <motion.section className="mb-12" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.37, duration: 0.6 }}>
          <h2 className="text-2xl font-bold text-primary mb-4">Support & Feedback</h2>
          <div className="bg-white rounded-xl shadow-md p-4 flex gap-4">
            <button onClick={() => setShowSupportModal(true)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Request Support</button>
            <button onClick={() => setShowFeedbackModal(true)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Submit Feedback</button>
          </div>
        </motion.section>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={() => setShowSupportModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">Request Support</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Describe your issue</label>
                  <textarea className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" rows={4} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors">Send Request</button>
              </form>
            </div>
          </div>
        )}
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
              <button onClick={() => setShowFeedbackModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
              <h2 className="text-2xl font-bold text-primary mb-4 text-center">Submit Feedback</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Your feedback</label>
                  <textarea className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary" rows={4} required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors">Send Feedback</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DoctorDashboard; 