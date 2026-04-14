import React, { useState } from 'react';
import { services } from '../data/doctor';

export default function BookAppointment() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // For demo: you could store in localStorage or send to backend here
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-blue-100">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">Appointment Booked!</h2>
            <p className="text-gray-700 mb-2">Thank you, {form.name}. Your appointment for <span className="font-semibold">{form.service}</span> on <span className="font-semibold">{form.date}</span> at <span className="font-semibold">{form.time}</span> has been received.</p>
            <p className="text-gray-500">We will contact you soon for confirmation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Book an Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Message (optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors\"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 