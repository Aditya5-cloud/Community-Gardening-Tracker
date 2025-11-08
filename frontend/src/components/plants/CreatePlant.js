import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiFeather, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const CreatePlant = () => {
  const { gardenId } = useParams();
  const [form, setForm] = useState({
    name: '',
    species: '',
    variety: '',
    plantedDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/plants/garden/${gardenId}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate(`/gardens/${gardenId}/dashboard`);
    } catch (err) {
      console.error('Error creating plant:', err);
      alert('Failed to create plant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add a New Plant</h1>
          <p className="text-gray-600">Log a new plant in your garden.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plant Name *
              </label>
              <input
                name="name"
                placeholder="e.g., Tomato"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Species *
              </label>
              <input
                name="species"
                placeholder="e.g., Solanum lycopersicum"
                value={form.species}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variety
              </label>
              <input
                name="variety"
                placeholder="e.g., Cherry"
                value={form.variety}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planted Date
              </label>
              <input
                type="date"
                name="plantedDate"
                value={form.plantedDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Plant...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4 mr-2" />
                    Add Plant
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePlant;