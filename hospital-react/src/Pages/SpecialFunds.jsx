import React, { useState } from 'react';

const aisha = {
  name: 'Aisha Yusuf',
  photo: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=400&q=80',
  story: `Aisha is a bright, loving young woman facing a serious medical challenge. She urgently needs financial support for her treatment and ongoing care. Your donation will help cover her hospital bills, medications, and recovery expenses. Every contribution, no matter how small, makes a difference. Thank you for your kindness and support!`,
  bank: {
    accountName: 'Aisha Yusuf',
    accountNumber: '1234567890',
    bankName: 'XYZ Bank',
  },
  goal: 2000000, // Naira
  raised: 1050000,
  contact: {
    phone: '+234 801 234 5678',
    email: 'supportaisha@email.com',
  },
};

export default function SpecialFunds() {
  const [copied, setCopied] = useState(false);
  const progress = Math.min(100, Math.round((aisha.raised / aisha.goal) * 100));

  const handleCopy = () => {
    navigator.clipboard.writeText(aisha.bank.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <img src={aisha.photo} alt="Aisha Yusuf" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200" />
          <div>
            <h1 className="text-3xl font-bold text-indigo-800 mb-2">Support Aisha</h1>
            <p className="text-gray-700 mb-2">{aisha.story}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">Bank Account Details</h2>
          <div className="bg-blue-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 border border-indigo-200">
            <div>
              <div><span className="font-semibold">Account Name:</span> {aisha.bank.accountName}</div>
              <div><span className="font-semibold">Account Number:</span> {aisha.bank.accountNumber} <button onClick={handleCopy} className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700">{copied ? 'Copied!' : 'Copy'}</button></div>
              <div><span className="font-semibold">Bank:</span> {aisha.bank.bankName}</div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition-colors mb-2">Donate</button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₦{aisha.raised.toLocaleString()} raised</span>
            <span>Goal: ₦{aisha.goal.toLocaleString()}</span>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-primary mb-2">Share & Spread the Word</h2>
          <div className="flex gap-4">
            <a href={`https://wa.me/?text=Support%20Aisha%20Yusuf%20with%20a%20donation!%20Bank%20details:%20${aisha.bank.accountNumber}%20(${aisha.bank.bankName})`} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://yourwebsite.com/support-aisha`} target="_blank" rel="noopener noreferrer" className="bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800">Facebook</a>
            <a href={`https://twitter.com/intent/tweet?text=Support%20Aisha%20Yusuf%20with%20a%20donation!%20Bank%20details:%20${aisha.bank.accountNumber}%20(${aisha.bank.bankName})`} target="_blank" rel="noopener noreferrer" className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500">Twitter</a>
          </div>
        </div>
        <div className="mb-2">
          <h2 className="text-xl font-bold text-primary mb-2">Contact for More Info</h2>
          <div className="text-gray-700">Phone: <a href={`tel:${aisha.contact.phone}`} className="text-blue-600 underline">{aisha.contact.phone}</a></div>
          <div className="text-gray-700">Email: <a href={`mailto:${aisha.contact.email}`} className="text-blue-600 underline">{aisha.contact.email}</a></div>
        </div>
      </div>
    </div>
  );
} 