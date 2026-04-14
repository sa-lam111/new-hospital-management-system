import React, { useEffect, useState } from 'react';
import { services } from '../data/doctor'; // Import from the same data file
import { motion } from 'framer-motion';

export default function Services() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookForm, setBookForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: '',
  });
  const [bookSubmitted, setBookSubmitted] = useState(false);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const servicesToShow = showAll ? filteredServices : filteredServices.slice(0, 6);

  const handleBookNow = (serviceName) => {
    setBookForm({
      name: '',
      email: '',
      phone: '',
      service: serviceName,
      date: '',
      time: '',
      message: '',
    });
    setBookSubmitted(false);
    setShowBookModal(true);
  };

  const handleBookChange = (e) => {
    setBookForm({ ...bookForm, [e.target.name]: e.target.value });
  };

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setBookSubmitted(true);
    // Here you could send to backend or store locally
  };

  const handleCloseBookModal = () => {
    setShowBookModal(false);
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
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">Our Medical Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive healthcare services delivered with compassion, expertise, and cutting-edge technology.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                placeholder="Search services..."
                className="w-full px-6 py-3 pl-12 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-colors"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servicesToShow.length > 0 ? (
                servicesToShow.map((service, idx) => (
                  <motion.div
                    key={service.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-blue-100 group flex flex-col"
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: idx * 0.1 }}
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <div className="p-8 flex flex-col h-full flex-1">
                      <div className="flex items-center mb-6">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                          <div className="w-12 h-1 bg-indigo-600 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-base leading-relaxed mb-6 flex-1">
                        {service.description}
                      </p>
                      <div className="flex gap-3 mb-2">
                        <button 
                          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                        >
                          {openIdx === idx ? 'Hide Details' : 'Learn More'}
                        </button>
                        <button className="px-4 py-3 border border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                          onClick={() => handleBookNow(service.name)}
                        >
                          Book Now
                        </button>
                      </div>
                      {openIdx === idx && (
                        <div className="mt-4 animate-fade-in text-gray-700">
                          <div className="font-semibold text-indigo-700 mb-2">Features of {service.name}:</div>
                          {service.id === 1 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>24/7 emergency room access</li>
                              <li>Advanced trauma and critical care</li>
                              <li>On-site ambulance and rapid response</li>
                              <li>Immediate diagnostics and stabilization</li>
                            </ul>
                          )}
                          {service.id === 2 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Comprehensive heart check-ups</li>
                              <li>Stress tests and ECG monitoring</li>
                              <li>Cholesterol and blood pressure screening</li>
                              <li>Personalized prevention plans</li>
                            </ul>
                          )}
                          {service.id === 3 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Well-child visits and immunizations</li>
                              <li>Developmental screenings</li>
                              <li>Care for acute and chronic illnesses</li>
                              <li>Parental guidance and support</li>
                            </ul>
                          )}
                          {service.id === 4 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Joint replacement and sports injury care</li>
                              <li>Minimally invasive orthopedic surgery</li>
                              <li>Physical therapy and rehabilitation</li>
                              <li>Fracture and trauma management</li>
                            </ul>
                          )}
                          {service.id === 5 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Prenatal and postnatal care</li>
                              <li>High-risk pregnancy management</li>
                              <li>Modern delivery suites</li>
                              <li>Breastfeeding and newborn support</li>
                            </ul>
                          )}
                          {service.id === 6 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>MRI, CT, X-ray, and ultrasound</li>
                              <li>Digital imaging and reporting</li>
                              <li>Expert radiologists</li>
                              <li>Quick turnaround for results</li>
                            </ul>
                          )}
                          {service.id === 7 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Minimally invasive and open surgery</li>
                              <li>Pre- and post-operative care</li>
                              <li>Experienced surgical team</li>
                              <li>Advanced operating theaters</li>
                            </ul>
                          )}
                          {service.id === 8 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Personalized cancer treatment plans</li>
                              <li>Chemotherapy and radiation therapy</li>
                              <li>Supportive care and counseling</li>
                              <li>Multidisciplinary oncology team</li>
                            </ul>
                          )}
                          {service.id === 9 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Injury and post-surgery rehabilitation</li>
                              <li>Physical and occupational therapy</li>
                              <li>Custom exercise programs</li>
                              <li>Pain management solutions</li>
                            </ul>
                          )}
                          {service.id === 10 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Skin exams and biopsies</li>
                              <li>Treatment for acne, eczema, and psoriasis</li>
                              <li>Cosmetic dermatology</li>
                              <li>Laser and minor surgical procedures</li>
                            </ul>
                          )}
                          {service.id === 11 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Psychiatric evaluation and counseling</li>
                              <li>Medication management</li>
                              <li>Support groups and therapy</li>
                              <li>Confidential mental health support</li>
                            </ul>
                          )}
                          {service.id === 12 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Endoscopy and colonoscopy</li>
                              <li>Diagnosis and treatment of digestive disorders</li>
                              <li>Liver and pancreas care</li>
                              <li>Nutrition and lifestyle counseling</li>
                            </ul>
                          )}
                          {service.id === 13 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Comprehensive eye exams</li>
                              <li>Vision correction and surgery</li>
                              <li>Glaucoma and cataract management</li>
                              <li>Pediatric ophthalmology</li>
                            </ul>
                          )}
                          {service.id === 14 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Ear, nose, and throat diagnostics</li>
                              <li>Allergy testing and treatment</li>
                              <li>Hearing aids and audiology</li>
                              <li>Sinus and tonsil surgery</li>
                            </ul>
                          )}
                          {service.id === 15 && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>Diabetes management and education</li>
                              <li>Thyroid and hormone disorder care</li>
                              <li>Insulin therapy and monitoring</li>
                              <li>Diet and lifestyle planning</li>
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
            
            {filteredServices.length > 6 && (
              <div className="flex justify-center mt-12">
                {!showAll ? (
                  <button
                    className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
                    onClick={() => setShowAll(true)}
                  >
                    <span>Show All Services</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
                    onClick={() => setShowAll(false)}
                  >
                    <span>Show Less</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Booking Modal */}
            {showBookModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative">
                  <button onClick={handleCloseBookModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                  {!bookSubmitted ? (
                    <>
                      <h2 className="text-2xl font-bold text-primary mb-4 text-center">Book {bookForm.service}</h2>
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
                          <input type="text" name="service" value={bookForm.service} readOnly className="w-full px-4 py-2 border rounded bg-gray-100" />
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
                        <button type="submit" className="w-full bg-indigo-700 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-indigo-800 transition-colors">Book Service</button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Service Booked!</h2>
                      <p className="text-gray-700 mb-2">Thank you, {bookForm.name}. Your booking for <span className="font-semibold">{bookForm.service}</span> on <span className="font-semibold">{bookForm.date}</span> at <span className="font-semibold">{bookForm.time}</span> has been received.</p>
                      <p className="text-gray-500">We will contact you soon for confirmation.</p>
                      <button onClick={handleCloseBookModal} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Close</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}