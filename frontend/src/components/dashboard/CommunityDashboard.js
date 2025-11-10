import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiUsers,
  FiSearch,
  FiMapPin,
  FiActivity,
  FiLogIn,
  FiHeart
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const CommunityDashboard = () => {
  const { user } = useAuth();
  const [createdCommunities, setCreatedCommunities] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingGarden, setDeletingGarden] = useState(null);
  const [leavingGarden, setLeavingGarden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!user || !token) {
          navigate('/login');
          return;
        }

        // --- CHANGE: Made paths relative ---
        const [mine, created] = await Promise.all([
          axios.get('/api/gardens/user/my-gardens', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/gardens/user/created', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const createdIds = new Set(created.data.map(c => c._id));
        
        setCreatedCommunities(created.data);
        setJoinedCommunities(
          mine.data.filter(g => !createdIds.has(g._id))
        );
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
      setLoading(false);
    };
    fetchCommunities();
  }, [user, navigate]);

  const handleDelete = async (gardenId) => {
    setDeletingGarden(gardenId);
    try {
      // --- CHANGE: Made path relative ---
      await axios.delete(`/api/gardens/${gardenId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCreatedCommunities(createdCommunities.filter(g => g._id !== gardenId));
    } catch (err) {
      alert('Failed to delete community');
    } finally {
      setDeletingGarden(null);
    }
  };

  const handleLeave = async (gardenId) => {
    setLeavingGarden(gardenId);
    try {
      // --- CHANGE: Made path relative ---
      await axios.post(`/api/gardens/${gardenId}/leave`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setJoinedCommunities(joinedCommunities.filter(g => g._id !== gardenId));
    } catch (err) {
      alert('Failed to leave community');
    } finally {
      setLeavingGarden(null);
    }
  };

  const myCommunitiesCount = createdCommunities.length;
  const joinedCommunitiesCount = joinedCommunities.length;
  const totalCommunities = myCommunitiesCount + joinedCommunitiesCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          {/* --- UPDATED: Scaled text for mobile --- */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Welcome back, <span className="text-green-600">{user?.firstName || 'Gardener'}</span>! 🌱
          </h1>
          {/* --- UPDATED: Scaled text for mobile --- */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            What would you like to do today?
          </p>
        </div>

        {/* Create and Join Community Buttons */}
        {/* --- UPDATED: Stack buttons on mobile, adjust size --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
            <Link
              to="/gardens/new"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Create a Community
            </Link>
            <Link
              to="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FiSearch className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Join a Community
            </Link>
        </div>


        {/* --- UPDATED: Made grid mobile-first (1 col) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Total Communities</p>
                <p className="text-3xl font-bold text-gray-900">{totalCommunities}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Created Gardens</p>
                <p className="text-3xl font-bold text-green-600">{myCommunitiesCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiHeart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Joined Communities</p>
                <p className="text-3xl font-bold text-orange-600">{joinedCommunitiesCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FiLogIn className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* --- UPDATED: Reduced padding for mobile --- */}
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Created Communities</h2>
              {createdCommunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-6">You haven't created any communities yet. Click the button above to start one!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {createdCommunities.map(garden => (
                    <div key={garden._id} className="garden-card min-w-0 w-full bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-medium transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-green-800 mb-2">{garden.name}</h3>
                          <p className="text-green-700 text-sm">{garden.description}</p>
                        </div>
                        <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-green-600 mb-4">
                        <FiUsers className="w-4 h-4 mr-1" />
                        <span>{garden.members.length || 0} members</span>
                      </div>
                      {/* --- UPDATED: Stack buttons on small screens --- */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to={`/gardens/${garden._id}/dashboard`} className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          View Dashboard
                        </Link>
                        <button
                          onClick={() => handleDelete(garden._id)}
                          disabled={deletingGarden === garden._id}
                          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {deletingGarden === garden._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- UPDATED: Reduced padding for mobile --- */}
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Joined Communities</h2>
              {joinedCommunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-6">You haven't joined any communities yet. Click the button above to discover some!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                  {joinedCommunities.map(garden => (
                    <div key={garden._id} className="garden-card min-w-0 w-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-medium transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-blue-800 mb-2">{garden.name}</h3>
                          <p className="text-blue-700 text-sm">{garden.description}</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                          <FiMapPin className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-blue-600 mb-4">
                        <FiUsers className="w-4 h-4 mr-1" />
                        <span>{garden.members.length || 0} members</span>
                      </div>
                      {/* --- UPDATED: Stack buttons on small screens --- */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link to={`/gardens/${garden._id}/dashboard`} className="w-full sm:w-auto text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          View Dashboard
                        </Link>
                        <button
                          onClick={() => handleLeave(garden._id)}
                          disabled={leavingGarden === garden._id}
                          className="w-full sm:w-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {leavingGarden === garden._id ? 'Leaving...' : 'Leave'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDashboard;