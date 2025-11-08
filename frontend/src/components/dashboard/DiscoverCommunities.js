import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiMapPin, FiPlus, FiSearch, FiLoader } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DiscoverCommunities = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningGarden, setJoiningGarden] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunities = async () => {
      setLoading(true);
      try {
        // Fetch all public communities first. This endpoint is public.
        const allRes = await axios.get('/api/gardens');
        let availableCommunities = allRes.data;

        // If the user is logged in, fetch their gardens to filter the list
        if (user && localStorage.getItem('token')) {
          const mineRes = await axios.get('/api/gardens/user/my-gardens', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          const myGardenIds = new Set(mineRes.data.map(g => g._id));

          // Filter out communities the user owns or has already joined
          availableCommunities = allRes.data.filter(
            garden => garden.owner !== user.id && !myGardenIds.has(garden._id)
          );
        }
        
        setCommunities(availableCommunities);

      } catch (err) {
        console.error('Failed to fetch communities:', err);
      } finally {
        // This is crucial: ensure loading is set to false in all cases.
        setLoading(false);
      }
    };
    
    fetchCommunities();
  }, [user]); // Depend on user to re-filter when auth state changes

  const handleJoin = async (gardenId) => {
    setJoiningGarden(gardenId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to login if not authenticated
        return;
      }
      await axios.post(`/api/gardens/${gardenId}/members`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/gardens/${gardenId}/dashboard`);
    } catch (err) {
      console.error('Failed to join community:', err);
      alert('Failed to join community. Please try again.');
    } finally {
      setJoiningGarden(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Communities</h1>
          <p className="text-lg text-gray-600">Find and join local gardening groups to grow together.</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-green-600 h-12 w-12" />
          </div>
        ) : communities.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-soft border"
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <FiSearch className="text-green-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No New Communities to Join</h2>
            <p className="text-gray-600 mb-6">It looks like you've joined all available communities, or there are none yet. Why not start your own?</p>
            <Link to="/gardens/new" className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
              <FiPlus className="w-5 h-5 mr-2" />
              Create a Community
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {communities.map(garden => (
                <motion.div 
                  key={garden._id} 
                  variants={itemVariants}
                  layout
                  className="bg-white rounded-2xl shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{garden.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{garden.description}</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiMapPin className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center"><FiMapPin className="w-4 h-4 mr-1.5 text-gray-400" /> {garden.location}</span>
                        <span className="flex items-center"><FiUsers className="w-4 h-4 mr-1.5 text-gray-400" /> {garden.memberCount} members</span>
                    </div>
                    <button
                      onClick={() => handleJoin(garden._id)}
                      disabled={joiningGarden === garden._id}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold"
                    >
                      {joiningGarden === garden._id ? (
                        <>
                          <FiLoader className="animate-spin w-5 h-5 mr-2" />
                          Joining...
                        </>
                      ) : (
                        'Join Community'
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DiscoverCommunities;