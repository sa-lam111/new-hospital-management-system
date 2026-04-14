import React, { useState } from 'react';
import { motion } from 'framer-motion';

const tips = [
  {
    title: 'Eat More Fruits & Vegetables',
    desc: 'Aim to fill half your plate with a variety of colorful fruits and vegetables. They are rich in vitamins, minerals, and fiber, and low in calories.'
  },
  {
    title: 'Choose Whole Grains',
    desc: 'Swap refined grains for whole grains like brown rice, oats, quinoa, and whole wheat bread. Whole grains help lower cholesterol and keep you full longer.'
  },
  {
    title: 'Limit Unhealthy Fats',
    desc: 'Reduce saturated and trans fats by choosing lean meats, low-fat dairy, and cooking with healthy oils like olive or canola. Avoid fried foods and processed snacks.'
  },
  {
    title: 'Reduce Salt (Sodium) Intake',
    desc: 'Too much salt can raise your blood pressure. Cook at home more often, use herbs and spices for flavor, and check food labels for sodium content.'
  },
  {
    title: 'Watch Your Portion Sizes',
    desc: 'Eating the right amount of food helps maintain a healthy weight. Use smaller plates, check serving sizes, and avoid going back for seconds.'
  },
];

export default function HeartHealthyTips() {
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = idx => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 min-h-screen py-12 px-4">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 text-center drop-shadow">5 Tips for a Heart-Healthy Diet</h1>
          <p className="text-lg text-gray-700 text-center max-w-xl">
            Eating well is one of the best ways to protect your heart and overall health. Here are five practical tips to help you build a heart-healthy diet.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          {tips.map((tip, idx) => (
            <motion.div
              key={idx}
              className="flex flex-col items-center bg-blue-50 rounded-xl shadow p-6 border-t-4 border-indigo-200 cursor-pointer select-none"
              whileHover={{ scale: 1.04 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              onClick={() => handleToggle(idx)}
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-2 text-center flex items-center justify-center">
                {tip.title}
                <span className="ml-2 text-base text-indigo-400">{openIdx === idx ? '▲' : '▼'}</span>
              </h2>
              <motion.div
                initial={false}
                animate={{ height: openIdx === idx ? 'auto' : 0, opacity: openIdx === idx ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`overflow-hidden w-full ${openIdx === idx ? 'mb-2' : ''}`}
              >
                {openIdx === idx && (
                  <p className="text-gray-700 text-center mt-2">{tip.desc}</p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <p className="text-gray-800 text-lg font-semibold">Small changes can make a big difference. Start today for a healthier heart!</p>
        </motion.div>
      </motion.div>
    </div>
  );
} 