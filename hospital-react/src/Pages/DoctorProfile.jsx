import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctors } from '../data/doctor';
import { motion } from 'framer-motion';

const mockReviews = [
  { id: 1, reviewer: 'Ngozi O.', rating: 5, comment: 'Excellent care and very professional.' },
  { id: 2, reviewer: 'Tunde A.', rating: 4, comment: 'Very knowledgeable and friendly.' },
];
const mockSchedule = [
  { day: 'Monday', time: '9:00 AM - 3:00 PM' },
  { day: 'Wednesday', time: '10:00 AM - 4:00 PM' },
  { day: 'Friday', time: '12:00 PM - 6:00 PM' },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating}</span>
    </div>
  );
}

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(d => d.id === Number(id));

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors">Back to Doctors</button>
      </div>
    );
  }

  return (
    <motion.div className="bg-gray-50 min-h-screen py-12 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-indigo-800 mb-2">{doctor.name}</h2>
            <div className="mb-2 text-gray-700">{doctor.bio}</div>
            <div className="mb-2"><span className="font-semibold">Specialty:</span> {doctor.specialty}</div>
            <div className="mb-2"><span className="font-semibold">Experience:</span> {doctor.experience}</div>
            <div className="mb-2"><span className="font-semibold">Education:</span> {doctor.education}</div>
            <div className="mb-2"><span className="font-semibold">Languages:</span> {doctor.languages.join(', ')}</div>
            <div className="mb-2"><span className="font-semibold">Certifications:</span> Board Certified</div>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Areas of Expertise</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>{doctor.specialty}</li>
            <li>General Medicine</li>
            <li>Patient Care</li>
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Patient Reviews</h3>
          <ul className="divide-y divide-gray-200">
            {mockReviews.map(r => (
              <li key={r.id} className="py-2">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={r.rating} />
                  <span className="font-semibold text-gray-800">{r.reviewer}</span>
                </div>
                <div className="text-gray-600">{r.comment}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">Availability / Schedule</h3>
          <ul className="text-gray-700">
            {mockSchedule.map(s => (
              <li key={s.day}><span className="font-semibold">{s.day}:</span> {s.time}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end">
          <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors">Book Appointment with {doctor.name}</button>
        </div>
      </div>
    </motion.div>
  );
} 