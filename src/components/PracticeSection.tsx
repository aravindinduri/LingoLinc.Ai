"use client";

import React from 'react';

function PracticeSection() {
  return (
    <div className="min-h-screen  p-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-400">
        Practice Languages
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* German Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Practice German
          </h2>
          <p className="text-gray-600 mb-6">
            Enhance your German skills with fun exercises. Perfect for beginners and advanced learners.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Start Practicing
          </button>
        </div>

        {/* French Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Practice French
          </h2>
          <p className="text-gray-600 mb-6">
            Immerse yourself in French exercises to improve your vocabulary and fluency.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Start Practicing
          </button>
        </div>

        {/* Add more language sections similarly */}
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Practice Spanish
          </h2>
          <p className="text-gray-600 mb-6">
            Master Spanish with a range of activities designed for every level.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Start Practicing
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Practice Japanese
          </h2>
          <p className="text-gray-600 mb-6">
            Dive into Japanese language exercises for both speaking and writing.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
            Start Practicing
          </button>
        </div>
      </div>
    </div>
  );
}

export default PracticeSection;
