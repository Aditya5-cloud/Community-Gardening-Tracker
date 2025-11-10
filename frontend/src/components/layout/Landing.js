import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";
import DiscoverCommunities from "../dashboard/DiscoverCommunities";
import { FiUsers, FiFeather, FiMessageCircle, FiArrowRight } from "react-icons/fi";

const features = [
  {
    icon: <FiUsers className="text-green-600 text-3xl" />,
    title: "Connect",
    desc: "Meet fellow gardeners and join vibrant communities.",
  },
  {
    icon: <FiFeather className="text-green-600 text-3xl" />,
    title: "Grow",
    desc: "Track your plants and garden progress with ease.",
  },
  {
    icon: <FiMessageCircle className="text-green-600 text-3xl" />,
    title: "Collaborate",
    desc: "Chat, share tips, and organize community events.",
  },
];

const Landing = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-green-200 relative">
    <LandingNavbar />
    <main>
      {/* Hero Section */}
      {/* --- UPDATED: Reduced padding for mobile --- */}
      <section className="flex flex-col items-center justify-center text-center pt-24 pb-12 md:pt-32 md:pb-16 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
            alt="Garden"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10">
          {/* --- UPDATED: Scaled text for mobile --- */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-lg mb-4">
            Grow Together, Thrive Together
          </h1>
          {/* --- UPDATED: Scaled text for mobile --- */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover, join, and nurture community gardens. Track your plants, connect with neighbors, and make your city greener!
          </p>
          <Link
            to="/login"
            // --- UPDATED: Scaled button padding and text for mobile ---
            className="inline-flex items-center px-8 py-3 text-base sm:px-10 sm:py-4 sm:text-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
          >
            Get Started <FiArrowRight className="ml-3" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white/80 backdrop-blur-md">
        {/* --- UPDATED: Added px-4 for mobile --- */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 hover:scale-105 transition-transform"
            >
              {f.icon}
              <h3 className="mt-4 text-2xl font-bold text-green-700">{f.title}</h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Discover Communities Section */}
      <section className="py-12">
        {/* --- UPDATED: Scaled text for mobile --- */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-8 px-4">
          Discover Community Gardens Near You
        </h2>
        <DiscoverCommunities />
      </section>
    </main>
  </div>
);

export default Landing;