import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiTrendingUp, FiCheckCircle, FiHeart, FiUsers } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    createdGardens: 0,
    joinedGardens: 0,
    tasksCompleted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [createdRes, joinedRes] = await Promise.all([
          axios.get('/api/gardens/user/created', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/gardens/user/my-gardens', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const createdIds = new Set(createdRes.data.map(g => g._id));
        const joinedCount = joinedRes.data.filter(g => !createdIds.has(g._id)).length;

        // In a real app, you would fetch task data as well.
        // For now, we'll use placeholder data for tasks.
        setStats({
          createdGardens: createdRes.data.length,
          joinedGardens: joinedCount,
          tasksCompleted: 15, // Placeholder
        });

      } catch (error) {
        console.error("Failed to fetch profile stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <LoadingSpinner text="Loading Profile..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-600 mt-1">@{user?.username}</p>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="flex items-center">
              <FiMail className="w-6 h-6 text-green-500 mr-4" />
              <div>
                <p className="font-semibold">Email</p>
                <p>{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FiCalendar className="w-6 h-6 text-green-500 mr-4" />
              <div>
                <p className="font-semibold">Member Since</p>
                <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
             <div className="flex items-center">
              <FiUser className="w-6 h-6 text-green-500 mr-4" />
              <div>
                <p className="font-semibold">Experience</p>
                <p className="capitalize">{user?.experience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="text-center p-4 bg-green-50 rounded-xl">
                    <FiHeart className="w-8 h-8 text-green-500 mx-auto mb-2"/>
                    <p className="text-2xl font-bold text-green-800">{stats.createdGardens}</p>
                    <p className="text-sm text-gray-600">Gardens Created</p>
                </div>
                 <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <FiUsers className="w-8 h-8 text-blue-500 mx-auto mb-2"/>
                    <p className="text-2xl font-bold text-blue-800">{stats.joinedGardens}</p>
                    <p className="text-sm text-gray-600">Gardens Joined</p>
                </div>
                 <div className="text-center p-4 bg-yellow-50 rounded-xl">
                    <FiCheckCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2"/>
                    <p className="text-2xl font-bold text-yellow-800">{stats.tasksCompleted}</p>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
            </div>
        </div>

        {/* Logout Button */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;