import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiGrid, 
  FiFeather, 
  FiCheckSquare, 
  FiCalendar, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiX,
  FiPlus
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
      description: 'Overview of your gardens'
    },
    {
      name: 'Gardens',
      href: '/gardens',
      icon: FiGrid,
      description: 'Manage your gardens'
    },
    {
      name: 'Plants',
      href: '/plants',
      icon: FiFeather,
      description: 'Track your plants'
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: FiCheckSquare,
      description: 'Manage garden tasks'
    },
    {
      name: 'Events',
      href: '/events',
      icon: FiCalendar,
      description: 'Community events'
    },
    {
      name: 'Community',
      href: '/community',
      icon: FiUsers,
      description: 'Connect with gardeners'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: FiBarChart2,
      description: 'Garden insights'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: FiSettings,
      description: 'App preferences'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🌱</span>
          </div>
          <span className="ml-3 text-lg font-bold text-gray-900 dark:text-white">
            Garden Tracker
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.experience || 'Beginner'} Gardener
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400'
                  }`}
                />
                <span className="flex-1">{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-6 bg-primary-600 dark:bg-primary-400 rounded-full"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Growing together 🌱
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 