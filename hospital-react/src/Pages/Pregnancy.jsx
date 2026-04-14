import React, { useState } from 'react';

const topics = [
  {
    title: 'Trimester Guide',
    summary: "Learn about the different stages of pregnancy, from the first trimester to the third. Understand the changes in your body and your baby's development.",
    details: (
      <div className="text-gray-700 mt-2 space-y-2">
        <div>
          <span className="font-semibold text-indigo-700">First Trimester (Weeks 1-12):</span> Rapid development, morning sickness, fatigue, and the first ultrasound. Start prenatal vitamins and schedule your first prenatal visit.
        </div>
        <div>
          <span className="font-semibold text-indigo-700">Second Trimester (Weeks 13-26):</span> Energy returns, baby bump shows, anatomy scan, and feeling baby movements. Focus on balanced nutrition and regular check-ups.
        </div>
        <div>
          <span className="font-semibold text-indigo-700">Third Trimester (Weeks 27-40):</span> Growth spurt, more frequent doctor visits, birth planning, and preparing for delivery. Watch for signs of labor and keep your hospital bag ready.
        </div>
      </div>
    )
  },
  {
    title: 'Nutrition & Wellness',
    summary: "Get tips on maintaining a healthy diet and lifestyle during pregnancy. Proper nutrition is crucial for you and your baby's health.",
    details: (
      <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
        <li>Eat a variety of fruits, vegetables, whole grains, and lean proteins.</li>
        <li>Stay hydrated—aim for 8-10 glasses of water daily.</li>
        <li>Take prenatal vitamins with folic acid and iron.</li>
        <li>Avoid raw fish, unpasteurized dairy, and high-mercury fish.</li>
        <li>Engage in light exercise (with your doctor's approval).</li>
        <li>Get enough sleep and manage stress with relaxation techniques.</li>
      </ul>
    )
  },
  {
    title: 'Appointments & Check-ups',
    summary: "Stay on top of your prenatal appointments and check-ups. Regular visits to your doctor are essential for monitoring your pregnancy.",
    details: (
      <div className="text-gray-700 mt-2 space-y-1">
        <div>• <span className="font-semibold">First Visit:</span> Confirm pregnancy, review medical history, and initial blood tests.</div>
        <div>• <span className="font-semibold">Monthly Visits:</span> Monitor baby's growth, check blood pressure, and address questions.</div>
        <div>• <span className="font-semibold">Ultrasounds:</span> Typically at 12 and 20 weeks to check development.</div>
        <div>• <span className="font-semibold">Third Trimester:</span> Visits become more frequent (every 2 weeks, then weekly).</div>
        <div>• <span className="font-semibold">Vaccinations:</span> Flu shot and Tdap are recommended during pregnancy.</div>
      </div>
    )
  },
  {
    title: 'Labor & Delivery',
    summary: "Prepare for labor and delivery with our guides and resources. Know what to expect and create your birth plan.",
    details: (
      <div className="text-gray-700 mt-2 space-y-2">
        <div><span className="font-semibold text-indigo-700">Signs of Labor:</span> Regular contractions, water breaking, and lower back pain.</div>
        <div><span className="font-semibold text-indigo-700">Birth Plan:</span> Discuss preferences for pain relief, delivery positions, and who will be present.</div>
        <div><span className="font-semibold text-indigo-700">Hospital Bag:</span> Pack essentials for you and baby (clothes, toiletries, documents).</div>
        <div><span className="font-semibold text-indigo-700">Support:</span> Have a support person or doula for encouragement and comfort.</div>
        <div><span className="font-semibold text-indigo-700">After Delivery:</span> Learn about postpartum care, breastfeeding, and newborn care basics.</div>
      </div>
    )
  },
];

const Pregnancy = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = idx => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="bg-gray-200 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-800 mb-4">Pregnancy Care</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to our pregnancy care section. We provide comprehensive resources and support for expectant mothers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, idx) => (
            <div key={topic.title} className="bg-white p-6 rounded-lg shadow-md flex flex-col">
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">{topic.title}</h2>
              <p className="text-gray-600 flex-1">{topic.summary}</p>
              <button
                onClick={() => handleToggle(idx)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                {openIdx === idx ? 'Hide Details' : 'Learn More'}
              </button>
              {openIdx === idx && (
                <div className="mt-4 animate-fade-in">
                  {topic.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Due Date Calculator */}
      <div className="max-w-2xl mx-auto mt-12 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-indigo-700 mb-4">Interactive Due Date Calculator</h2>
        <DueDateCalculator />
      </div>
    </div>
  );
};

export default Pregnancy;

function DueDateCalculator() {
  const [lastPeriod, setLastPeriod] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  const calculateDueDate = () => {
    if (!lastPeriod) return;
    const start = new Date(lastPeriod);
    const due = new Date(start);
    due.setDate(due.getDate() + 280); // 40 weeks
    setDueDate(due.toDateString());
  };

  return (
    <div>
      <label className="block text-indigo-800 font-semibold mb-2">First Day of Last Period</label>
      <input
        type="date"
        value={lastPeriod}
        onChange={e => setLastPeriod(e.target.value)}
        className="border border-indigo-300 rounded px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-indigo-400"
      />
      <button
        onClick={calculateDueDate}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition-colors"
        disabled={!lastPeriod}
      >
        Calculate Due Date
      </button>
      {dueDate && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-indigo-400 rounded">
          <span className="block text-indigo-700 font-semibold">Estimated Due Date:</span>
          <span className="text-xl font-bold text-indigo-800">{dueDate}</span>
        </div>
      )}
    </div>
  );
} 