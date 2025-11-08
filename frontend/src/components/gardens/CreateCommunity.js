import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMapPin, 
  FiUsers, 
  FiSun, 
  FiDroplet, 
  FiFeather, 
  FiHome,
  FiCheckCircle,
  FiInfo,
  FiArrowRight
} from 'react-icons/fi';
import axios from 'axios';

const CreateCommunity = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    size: '',
    soilType: '',
    climate: '',
    category: 'community'
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Only proceed with submission if on the final step.
    if (currentStep === 2) {
      setLoading(true);
      try {
        console.log('Creating garden with data:', form);
        // console.log('Token:', localStorage.getItem('token'));
        
        // --- CHANGE: Made path relative ---
        const res = await axios.post('/api/gardens', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        console.log('Garden created successfully:', res.data);
        console.log('Redirecting to:', `/gardens/${res.data._id}/dashboard`);
        
        // Redirect directly. The 'await' on the previous line ensures the data is saved.
        navigate(`/gardens/${res.data._id}/dashboard`);
      } catch (err) {
        console.error('Error creating garden:', err);
        console.error('Error response:', err.response?.data);
        alert('Failed to create community');
      } finally {
        setLoading(false);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => {
    const requiredFields = {
      1: ['name', 'description'],
      2: ['location', 'size']
    };
    
    const currentRequired = requiredFields[currentStep] || [];
    const filledFields = currentRequired.filter(field => form[field].trim() !== '');
    // Handle division by zero if there are no required fields for a step
    if (currentRequired.length === 0) {
        return 100;
    }
    return (filledFields.length / currentRequired.length) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUsers className="inline w-4 h-4 mr-2 text-green-600" />
                Community Name *
              </label>
              <input
                name="name"
                placeholder="e.g., Urban Garden Collective"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Choose a memorable name for your community</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiFeather className="inline w-4 h-4 mr-2 text-green-600" />
                Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe your community garden's mission, goals, and what makes it special..."
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">Help others understand your community's purpose</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiHome className="inline w-4 h-4 mr-2 text-green-600" />
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="community">Community Garden</option>
                <option value="urban">Urban Farm</option>
                <option value="school">School Garden</option>
                <option value="therapeutic">Therapeutic Garden</option>
                {/* <option value="rooftop">Rooftop Garden</option>
                <option value="vertical">Vertical Garden</option> */}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="inline w-4 h-4 mr-2 text-green-600" />
                Location *
              </label>
              <input
                name="location"
                placeholder="e.g., 123 Main Street, City, State"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Exact address or general area description</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiSun className="inline w-4 h-4 mr-2 text-green-600" />
                Garden Size
              </label>
              <input
                name="size"
                placeholder="e.g., 500 sq ft, 1 acre, 10 raised beds"
                value={form.size}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">Approximate size of your garden area</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start">
                <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Location Tips</h4>
                  <p className="text-sm text-blue-700">
                    Consider accessibility, sunlight exposure, and water availability when choosing your garden location.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Community Garden</h1>
          <p className="text-gray-600">Build a thriving community around sustainable gardening 🌱</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Step {currentStep} of 2</h2>
            <span className="text-sm text-gray-500">{Math.round(getStepProgress())}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span className={currentStep >= 1 ? 'text-green-600 font-medium' : ''}>Basic Info</span>
            <span className={currentStep >= 2 ? 'text-green-600 font-medium' : ''}>Location</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={getStepProgress() < 100}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next Step
                    <FiArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Community...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle className="w-4 h-4 mr-2" />
                        Create Community
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mt-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Community Building Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Start with clear goals and regular communication</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Plan for different skill levels and time commitments</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Consider accessibility and inclusive design</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Document your journey to inspire others</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunity;