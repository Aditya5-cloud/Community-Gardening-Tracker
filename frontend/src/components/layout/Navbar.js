import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiSearch,
  FiX,
  FiMessageSquare
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This is a simplified check. In a real app, you would use WebSockets 
    // or a more sophisticated notification system.
    const checkNewMessages = async () => {
        // This logic is a placeholder. A real implementation would require a dedicated endpoint.
        // For now, we just simulate the notification dot.
        setHasNewMessage(true); 
    };

    if (user) {
        const interval = setInterval(checkNewMessages, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-soft border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center ml-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🌱</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  Garden Tracker
                </span>
              </div>
            </Link>
          </div>

          {/* Center - Search
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search gardens, plants, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </form>
          </div> */}

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme toggle */}
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            >
              {isDarkMode ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button> */}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <FiBell className="h-5 w-5" />
                {hasNewMessage && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    /*
                      --- *** UPDATED THIS LINE *** ---
                      - `w-[90vw]`: Sets width to 90% of the viewport, so it never overflows.
                      - `max-w-sm`: Caps the width at 24rem (384px) on larger screens.
                      - `sm:w-80`: Reverts to the original 20rem (320px) width on small screens and up.
                      - `right-0`: Aligns the right edge of the dropdown to the right edge of the parent.
                    */
                    className="absolute right-0 mt-2 w-[90vw] max-w-sm sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-large border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                         {hasNewMessage && (
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <p className="text-sm text-purple-800 dark:text-purple-200 flex items-center">
                                <FiMessageSquare className="w-4 h-4 mr-2" />
                                New message in Community Chat
                              </p>
                              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                Just now
                              </p>
                            </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium pr-2">
                  {user?.firstName}
                </span>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    /*
                      --- *** UPDATED THIS LINE *** ---
                      - `w-[90vw]`: Sets width to 90% of the viewport.
                      - `max-w-xs`: Caps the width at 20rem (320px).
                      - `sm:w-56`: Reverts to the original 14rem (224px) width on small screens and up.
                    */
                    className="absolute right-0 mt-2 w-[90vw] max-w-xs sm:w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-white">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiUser className="mr-3 h-4 w-4" />
                        My Profile
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiLogOut className="mr-3 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;