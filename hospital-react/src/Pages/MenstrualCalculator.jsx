import React, { useState } from 'react';

const MenstrualCalculator = () => {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [nextPeriod, setNextPeriod] = useState(null);
  const [ovulationDate, setOvulationDate] = useState(null);

  const calculate = () => {
    if (lastPeriodDate) {
      const date = new Date(lastPeriodDate);
      
  
      const nextPeriodDate = new Date(date);
      nextPeriodDate.setDate(date.getDate() + parseInt(cycleLength, 10));
      setNextPeriod(nextPeriodDate.toDateString());

      // Calculate approximate ovulation date
      const ovulation = new Date(date);
      ovulation.setDate(date.getDate() + parseInt(cycleLength, 10) - 14);
      setOvulationDate(ovulation.toDateString());
    }
  };

  return (
    <div className="bg- min-h-screen p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">Menstrual Cycle Calculator</h1>
        
        <div className="mb-4">
          <label htmlFor="lastPeriodDate" className="block text-indigo-700 font-semibold mb-2">
            First Day of Your Last Period
          </label>
          <input
            type="date"
            id="lastPeriodDate"
            value={lastPeriodDate}
            onChange={(e) => setLastPeriodDate(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="cycleLength" className="block text-indigo-700 font-semibold mb-2">
            Average Cycle Length (in days)
          </label>
          <input
            type="number"
            id="cycleLength"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            className="w-full p-2 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Calculate
        </button>

        {nextPeriod && (
          <div className="mt-8 p-4 bg-blue-50 border border-indigo-200 rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-800">Results</h2>
            <p className="mt-2 text-gray-700">
              Your next estimated period is: <strong className="text-indigo-600">{nextPeriod}</strong>
            </p>
            <p className="mt-2 text-gray-700">
              Your approximate ovulation day is: <strong className="text-indigo-600">{ovulationDate}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-600">
              *This is an estimation. Ovulation can vary cycle-to-cycle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenstrualCalculator; 