import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* 404 Icon */}
        <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6">
          <span className="text-white text-6xl">🌱</span>
        </div>

        {/* Error Message */}
        {/* --- UPDATED: Scaled text for mobile --- */}
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4">404</h1>
        {/* --- UPDATED: Scaled text for mobile --- */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        {/* --- UPDATED: Reduced margin for mobile --- */}
        <p className="text-gray-600 mb-6 sm:mb-8">
          The page you're looking for seems to have wandered off into the garden. 
          Let's get you back to where you need to be.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <FiHome className="mr-2" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Floating Garden Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-primary-400 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['🌱', '🌿', '🌸', '🌻', '🍃', '🌺', '🌼', '🌷'][i % 8]}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;