import { useEffect, useState } from 'react';
import { doctors } from '../data/doctor';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const mockReviews = [
  { id: 1, reviewer: 'Ngozi O.', rating: 5, comment: 'Excellent care and very professional.' },
  { id: 2, reviewer: 'Tunde A.', rating: 4, comment: 'Very knowledgeable and friendly.' },
];
const mockSchedule = [
  { day: 'Monday', time: '9:00 AM - 3:00 PM' },
  { day: 'Wednesday', time: '10:00 AM - 4:00 PM' },
  { day: 'Friday', time: '12:00 PM - 6:00 PM' },
];

export default function Doctors() {
  const [loading, setLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [showProfile, setShowProfile] = useState(false);
  const [profileDoctor, setProfileDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const specialties = ['All', ...new Set(doctors.map(doctor => doctor.specialty))];
  
  const filteredDoctors = selectedSpecialty === 'All' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty);

  const StarRating = ({ rating }) => {
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
  };

  const handleViewProfile = (doctor) => {
    navigate(`/doctor/${doctor.id}`);
  };
  const handleCloseProfile = () => {
    setShowProfile(false);
    setProfileDoctor(null);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Our Medical Specialists</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our team of experienced and dedicated healthcare professionals committed to providing exceptional care.
          </p>
        </motion.div>

        {/* Specialty Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {specialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedSpecialty === specialty
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-blue-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="relative">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {doctor.specialty}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                    <StarRating rating={doctor.rating} />
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{doctor.bio}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium w-20">Experience:</span>
                      <span>{doctor.experience}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium w-20">Education:</span>
                      <span>{doctor.education}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium w-20">Languages:</span>
                      <span>{doctor.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="font-medium w-20">Patients:</span>
                      <span>{doctor.patients.toLocaleString()}+</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                      Book Appointment
                    </button>
                    <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors" onClick={() => handleViewProfile(doctor)}>
                      View Profile
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {filteredDoctors.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found for the selected specialty.</p>
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
      {showProfile && profileDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
            <button onClick={handleCloseProfile} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
              <img src={profileDoctor.image} alt={profileDoctor.name} className="w-40 h-40 rounded-full object-cover border-4 border-blue-200" />
              <div>
                <h2 className="text-3xl font-bold text-indigo-800 mb-2">{profileDoctor.name}</h2>
                <div className="mb-2 text-gray-700">{profileDoctor.bio}</div>
                <div className="mb-2"><span className="font-semibold">Specialty:</span> {profileDoctor.specialty}</div>
                <div className="mb-2"><span className="font-semibold">Experience:</span> {profileDoctor.experience}</div>
                <div className="mb-2"><span className="font-semibold">Education:</span> {profileDoctor.education}</div>
                <div className="mb-2"><span className="font-semibold">Languages:</span> {profileDoctor.languages.join(', ')}</div>
                <div className="mb-2"><span className="font-semibold">Certifications:</span> Board Certified</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">Areas of Expertise</h3>
              <ul className="list-disc pl-6 text-gray-700">
                <li>{profileDoctor.specialty}</li>
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
              <button className="bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors">Book Appointment with {profileDoctor.name}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}