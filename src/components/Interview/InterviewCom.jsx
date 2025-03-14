import React, { useState } from 'react';

export const InterviewCom = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Icon and Heading */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full text-red-600">
            <circle cx="35" cy="35" r="15" fill="currentColor" />
            <circle cx="65" cy="35" r="15" fill="currentColor" />
            <circle cx="50" cy="50" r="25" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Which role do you want to interview for?</h1>
        <p className="text-gray-600 text-center">Just pick the role you'd like to go for in the interview!</p>
      </div>
      
      {/* Role Selection Options */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
        {/* Current Role */}
        <div 
          className={`w-full max-w-xs p-6 border rounded-xl cursor-pointer transition-all ${selectedRole === 'current' ? 'border-red-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => handleRoleSelect('current')}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-bold mb-1">Current Role</h2>
            <p className="text-sm text-gray-500">Software Engineer</p>
            <div className="mt-4 inline-flex items-center text-sm text-gray-500">
              <span>Select</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Senior Role */}
        <div 
          className={`w-full max-w-xs p-6 border rounded-xl cursor-pointer transition-all ${selectedRole === 'senior' ? 'border-red-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => handleRoleSelect('senior')}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-bold mb-1">Senior Role</h2>
            <p className="text-sm text-gray-500">Software Engineer</p>
            <div className="mt-4 inline-flex items-center text-sm text-gray-500">
              <span>Select</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Target Role */}
        <div 
          className={`w-full max-w-xs p-6 border rounded-xl cursor-pointer transition-all ${selectedRole === 'target' ? 'border-red-500 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
          onClick={() => handleRoleSelect('target')}
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700">
                <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="font-bold mb-1">Target Role</h2>
            <p className="text-sm text-gray-500">Software Engineer</p>
            <div className="mt-4 inline-flex items-center text-sm text-gray-500">
              <span>Select</span>
              <svg viewBox="0 0 24 24" className="w-4 h-4 ml-1">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};