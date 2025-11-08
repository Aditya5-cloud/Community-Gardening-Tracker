import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const LandingNavbar = () => (
  <nav className="fixed w-full top-0 left-0 z-50 bg-white/70 backdrop-blur-md shadow-md">
    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-700">🌱</span>
        <span className="font-bold text-xl text-gray-900">Garden Tracker</span>
      </Link>
      <Link
        to="/login"
        className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
      >
        Get Started <FiArrowRight className="ml-2" />
      </Link>
    </div>
  </nav>
);

export default LandingNavbar;