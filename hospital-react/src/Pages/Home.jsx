import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Home Page
 * Professional healthcare portal homepage with services, specialties, and booking capabilities
 */
export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    preferredDate: '',
    message: '',
  });

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    navigate('/book-appointment', { state: { initialData: bookingForm } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-white">
        {/* ==================== HERO SECTION ==================== */}
      <motion.section
        className="relative text-white py-24"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/1200x/af/48/43/af48435a71106620efcfe205e38dab92.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Compassionate Care, Trusted Professionals
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl mb-8 font-light max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Modern, patient-focused healthcare with expert doctors, advanced diagnostics, and 24/7 support for you and your family.
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button
                onClick={() => navigate(isAuthenticated ? '/patient' : '/book-appointment')}
                className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Book an Appointment
              </button>
              <button
                onClick={() => navigate('/about')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-indigo-700 transition-colors"
              >
                Explore Services
              </button>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
            >
              <span className="bg-white/20 px-3 py-1 rounded-full">24/7 Emergency Support</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Certified Specialists</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">Secure Patient Portal</span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==================== KEY FEATURES SECTION ==================== */}
      <motion.section
        className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <motion.div
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow border border-blue-100"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">24 HOUR SERVICE</h3>
              <p className="text-gray-600">All medical services available round the clock for your emergency needs</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">EXQUISITE FACILITY</h3>
              <p className="text-gray-600">State-of-the-art equipment and exemplary facilities for optimal patient care</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h-2m0 0h-2m2 0v-2m0 2v2m6-8h.01M20 6a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h16z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">EXPERIENCED STAFF</h3>
              <p className="text-gray-600">Board-certified and well-qualified medical professionals dedicated to your health</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              className="bg-white rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">AMBULANCE SERVICE</h3>
              <p className="text-gray-600">Emergency ambulance services available at all times with trained personnel</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==================== HEALTH SERVICES SECTION ==================== */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">HEALTH SERVICES</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs with excellence and care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Laboratory */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-blue-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">LABORATORY</h3>
              <p className="text-gray-700">Advanced diagnostic laboratory with modern equipment for accurate and timely test results.</p>
            </motion.div>

            {/* X-Ray */}
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-purple-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">X-RAY</h3>
              <p className="text-gray-700">Digital radiography services with latest imaging technology for accurate diagnosis.</p>
            </motion.div>

            {/* Ultrasound */}
            <motion.div
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-indigo-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">ULTRASOUND</h3>
              <p className="text-gray-700">High-resolution ultrasound imaging for detailed diagnostic assessment.</p>
            </motion.div>

            {/* Endoscopy */}
            <motion.div
              className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-pink-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">ENDOSCOPY</h3>
              <p className="text-gray-700">Minimally invasive diagnostic and therapeutic endoscopic procedures.</p>
            </motion.div>

            {/* Ambulance */}
            <motion.div
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-red-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">AMBULANCE</h3>
              <p className="text-gray-700">Emergency medical transport with trained paramedics available 24/7.</p>
            </motion.div>

            {/* Blood Bank */}
            <motion.div
              className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 hover:shadow-xl transition-shadow border-l-4 border-orange-500"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-4">
                <svg className="w-14 h-14 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">BLOOD BANK</h3>
              <p className="text-gray-700">Safe and reliable blood banking facility with tested and screened blood products.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ==================== SPECIALTIES SECTION ==================== */}
      <motion.section
        className="py-20 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">OUR SPECIALTIES</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              World-class medical specialties with experienced, certified professionals committed to your health
            </p>
          </motion.div>

          {/* Surgery */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-12 mb-10"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl font-bold text-indigo-700 mb-4">Surgery</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We provide acute surgical care and elective surgical services encompassing general surgery, orthopedics, plastic surgery, ear/nose/throat, urology, neurosurgery and gynecology. Our experienced surgical teams use advanced techniques and state-of-the-art operating facilities.
                </p>
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                >
                  Schedule Surgery Consultation
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1631217314830-4e536219c474?auto=format&fit=crop&w=500&q=60"
                  alt="Surgery"
                  className="rounded-lg shadow-lg w-full object-cover h-80"
                />
              </div>
            </div>
          </motion.div>

          {/* Medicine */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-12 mb-10"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div className="flex justify-center md:order-2">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=60"
                  alt="Medicine"
                  className="rounded-lg shadow-lg w-full object-cover h-80"
                />
              </div>
              <div className="md:order-1">
                <h3 className="text-3xl font-bold text-indigo-700 mb-4">Medicine</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We provide general medical services as well as specialist services in internal medicine, cardiology, pulmonology, gastroenterology, psychiatry, neurology, and geriatrics. Our medical specialists are committed to evidence-based practice and comprehensive patient care.
                </p>
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                >
                  Book Medical Appointment
                </button>
              </div>
            </div>
          </motion.div>

          {/* Maternal & Child Health */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-12"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl font-bold text-indigo-700 mb-4">Maternal & Child Health</h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We provide quality obstetrics and pediatric services including antenatal care, safe delivery services, postnatal care, and comprehensive child health services. Our dedicated team ensures the health and safety of both mother and child.
                </p>
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors"
                >
                  Schedule Health Checkup
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b2e?auto=format&fit=crop&w=500&q=60"
                  alt="Maternal & Child Health"
                  className="rounded-lg shadow-lg w-full object-cover h-80"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ==================== BOOK APPOINTMENT SECTION ==================== */}
      <motion.section
        className="relative py-20 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >

        <div className="relative container mx-auto px-4 max-w-4xl">
          <motion.div className="text-center mb-12" initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">BOOK AN APPOINTMENT</h2>
            <p className="text-lg font-light text-white drop-shadow-md">
              Fill in the form below to easily set up an appointment and someone will get in touch with you as soon as possible.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleBookingSubmit}
            className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-blue-100"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={bookingForm.fullName}
                  onChange={handleBookingChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleBookingChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleBookingChange}
                  placeholder="Enter your phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
            
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={bookingForm.department}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                >
                  <option value="">Select a department</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Laboratory">Laboratory</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Date *</label>
                <input
                  type="date"
                  name="preferredDate"
                  value={bookingForm.preferredDate}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Information</label>
              <textarea
                name="message"
                value={bookingForm.message}
                onChange={handleBookingChange}
                placeholder="Any additional information or medical concerns"
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-700 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-800 transition-colors shadow-lg"
            >
              BOOK AN APPOINTMENT
            </button>
          </motion.form>
        </div>
      </motion.section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-950 text-gray-300 py-16 border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4 className="text-white font-bold text-lg mb-6 uppercase">Contact Information</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-2">
                    123 Hospital Street, Medical District<br />
                    Healthcare City, HC 12345<br />
                    Fountain University, Osun, Nigeria
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">
                    <span className="font-semibold text-indigo-400">Reception:</span> +1 (555) 123-4567
                  </p>
                  <p className="text-gray-400 mb-1">
                    <span className="font-semibold text-indigo-400">Complaints:</span> +1 (555) 123-4568
                  </p>
                  <p className="text-gray-400">
                    <span className="font-semibold text-indigo-400">Billing:</span> +1 (555) 123-4569
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">
                    <a href="mailto:info@hospital.com" className="hover:text-indigo-400 transition-colors">
                      info@hospital.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-white font-bold text-lg mb-6 uppercase">Additional Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/" className="hover:text-indigo-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-indigo-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="hover:text-indigo-400 transition-colors">
                    Our Specialities
                  </a>
                </li>
                <li>
                  <a href="/doctors" className="hover:text-indigo-400 transition-colors">
                    Articles
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-indigo-400 transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Our Partners */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-white font-bold text-lg mb-6 uppercase">Our Partners</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded p-4 flex items-center justify-center h-16 hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 text-sm">Partner 1</span>
                </div>
                <div className="bg-gray-800 rounded p-4 flex items-center justify-center h-16 hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 text-sm">Partner 2</span>
                </div>
                <div className="bg-gray-800 rounded p-4 flex items-center justify-center h-16 hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 text-sm">Partner 3</span>
                </div>
                <div className="bg-gray-800 rounded p-4 flex items-center justify-center h-16 hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 text-sm">Partner 4</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>&copy; Copyright {new Date().getFullYear()} | All Rights Reserved</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}