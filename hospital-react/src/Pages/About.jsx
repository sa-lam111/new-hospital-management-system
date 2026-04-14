import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>,
      title: 'Compassion', 
      desc: 'Respect & care for every individual' 
    },
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
      title: 'Integrity', 
      desc: 'Transparency in all we do' 
    },
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      title: 'Innovation', 
      desc: 'Continuous learning & improvement' 
    },
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
      title: 'Collaboration', 
      desc: 'Teamwork across disciplines' 
    },
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>,
      title: 'Community', 
      desc: 'Engagement & local support' 
    },
    { 
      icon: <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      title: 'Excellence', 
      desc: 'World-class standards always' 
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative h-96 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551076805-e1869033e96e?auto=format&fit=crop&w=1200&q=80)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center text-white"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">About MediCare Hospital</h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">Delivering Excellence in Healthcare Since 2005</p>
          </div>
        </motion.div>
      </motion.section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-indigo-700 mb-6">Our Mission & Vision</h2>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Our Mission
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To deliver exceptional, patient-centered care with integrity, innovation, and excellence. We strive to be a beacon of hope for our community.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-indigo-600 mb-3 flex items-center">
                  <svg className="w-8 h-8 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Our Vision
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To be the leading healthcare provider, recognized for clinical excellence, advanced technology, and a commitment to the well-being of every patient and their family.
                </p>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=500&q=60"
                alt="Hospital"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 text-white rounded-2xl p-6 shadow-lg w-48">
                <p className="text-4xl font-bold">19+</p>
                <p className="text-sm font-semibold">Years of Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-indigo-700 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full mb-6"></div>
          </motion.div>

          <motion.p
            className="text-lg text-gray-700 leading-loose text-center mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Founded in 2005, MediCare Hospital has evolved from a small clinic into a state-of-the-art medical center serving thousands of patients each year. Our dedicated team of world-class professionals is committed to making a positive impact on the lives of our patients and their families through compassionate care and cutting-edge medical expertise.
          </motion.p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-indigo-700 mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-shadow border-t-4 border-indigo-600"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-indigo-700 mb-6">Join Us on Our Journey</h2>
            <p className="text-lg text-gray-700 mb-8">
              Experience healthcare the way it should be—with compassion, expertise, and a commitment to your wellness.
            </p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
              Schedule Your Appointment
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 