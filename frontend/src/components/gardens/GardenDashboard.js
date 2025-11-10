import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiUsers,
  FiMapPin,
  FiSun,
  FiFeather,
  FiCalendar,
  FiPlus,
  FiMessageSquare,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiTrash2
} from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const PlantDetailsModal = ({ plant, onClose }) => (
 
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* --- UPDATED: Reduced padding for mobile --- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{plant.name}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Species:</strong> {plant.species}</p>
          <p><strong>Variety:</strong> {plant.variety}</p>
          <p><strong>Planted Date:</strong> {new Date(plant.plantedDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span className="capitalize">{plant.status}</span></p>
          <p><strong>Health:</strong> <span className="capitalize">{plant.health}</span></p>
        </div>
      </div>
    </div>
  );

  const EventDetailsModal = ({ event, onClose }) => (
   
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
     
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Attendees:</strong> {event.attendees.length}</p>
        </div>
      </div>
    </div>
  );

  const TaskDetailsModal = ({ task, onClose }) => (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
     
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <FiX className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Type:</strong> <span className="capitalize">{task.type}</span></p>
            <p><strong>Priority:</strong> <span className="capitalize">{task.priority}</span></p>
            <p><strong>Status:</strong> <span className="capitalize">{task.status}</span></p>
        </div>
      </div>
    </div>
  );

const GardenDashboard = () => {
  const { gardenId } = useParams();
  const { user } = useAuth();
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState([]);
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const formatRelativeTime = (date) => {
    const now = new Date();
    const seconds = Math.round((now - new Date(date)) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const fetchGardenData = async () => {
    try {
    
      const [gardenRes, plantsRes, eventsRes, tasksRes] = await Promise.all([
        axios.get(`/api/gardens/${gardenId}`),
        axios.get(`/api/plants/garden/${gardenId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`/api/events/garden/${gardenId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        axios.get(`/api/tasks/garden/${gardenId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      
      setGarden(gardenRes.data);
      setPlants(plantsRes.data);
      setEvents(eventsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching garden data:', error);
      setGarden(null); 
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
    setLoading(true);
    fetchGardenData();
  }, [gardenId]);

  const handleDeletePlant = async (plantId) => {
    if(window.confirm('Are you sure you want to delete this plant?')) {
      try {

        await axios.delete(`/api/plants/${plantId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setPlants(plants.filter(p => p._id !== plantId));
        toast.success('Plant deleted successfully');
      } catch (error) {
        console.error('Error deleting plant:', error);
        toast.error('Failed to delete plant');
      }
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
   
      const res = await axios.patch(`/api/tasks/${taskId}/status`, { status: 'completed' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
      toast.success('Task marked as complete!');
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    }
  };

  const getStats = () => {
    if (!garden) return {};
    
    const upcomingEvents = events.filter(e => 
      e.status === 'upcoming' && new Date(e.date) > new Date()
    );
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const pendingTasks = tasks.filter(t => t.status === 'pending');

    return {
      totalMembers: garden.members?.length || 0,
      activeMembers: garden.members?.length || 0, 
      totalPlants: plants.length,
      upcomingEvents: upcomingEvents.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalTasks: tasks.length
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    plants.slice(0, 2).forEach(plant => {
      activities.push({
        id: plant._id,
        type: 'plant',
        user: `${plant.plantedBy?.firstName || ''} ${plant.plantedBy?.lastName || ''}`.trim(),
        action: `planted ${plant.name}`,
        time: plant.createdAt,
        icon: FiTrendingUp,
        color: 'green'
      });
    });

    events.slice(0, 2).forEach(event => {
      activities.push({
        id: event._id,
        type: 'event',
        user: `${event.createdBy?.firstName || ''} ${event.createdBy?.lastName || ''}`.trim(),
        action: `created event: ${event.title}`,
        time: event.createdAt,
        icon: FiCalendar,
        color: 'blue'
      });
    });

    tasks.slice(0, 2).forEach(task => {
      activities.push({
        id: task._id,
        type: 'task',
        user: `${task.assignedBy?.firstName || ''} ${task.assignedBy?.lastName || ''}`.trim(),
        action: `created task: ${task.title}`,
        time: task.createdAt,
        icon: FiCheckCircle,
        color: 'yellow'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 4);
  };

  const getUpcomingEvents = () => {
    return events
      .filter(e => e.status === 'upcoming' && new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
  };

  const getActivityIcon = (activity) => {
    const IconComponent = activity.icon;
    return <IconComponent className={`w-4 h-4 text-${activity.color}-500`} />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      community: 'green',
      urban: 'blue',
      school: 'purple',
      therapeutic: 'pink',
      rooftop: 'orange',
      vertical: 'indigo'
    };
    return colors[category] || 'green';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading garden dashboard...</p>
        </div>
      </div>
    );
  }

  if (!garden) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Garden Not Found</h2>
          <p className="text-gray-600 mb-6">The garden you're looking for doesn't exist or you don't have access.</p>
          <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {selectedPlant && <PlantDetailsModal plant={selectedPlant} onClose={() => setSelectedPlant(null)} />}
        {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
        {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* --- UPDATED: Reduced padding for mobile --- */}
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${getCategoryColor(garden.category)}-100 rounded-xl flex items-center justify-center mr-4`}>
                  <FiFeather className={`w-6 h-6 text-${getCategoryColor(garden.category)}-600`} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{garden.name}</h1>
                  <p className="text-gray-600 capitalize">{garden.category} Garden</p>
                </div>
              </div>
              <p className="text-gray-700 text-base sm:text-lg mb-4">{garden.description}</p>
            
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiMapPin className="w-4 h-4 mr-2 text-green-600" />
                  <span>{garden.location}</span>
                </div>
                {garden.size && (
                  <div className="flex items-center">
                    <FiSun className="w-4 h-4 mr-2 text-yellow-600" />
                    <span>{garden.size}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-2 text-blue-600" />
                                     <span>{stats.totalMembers} members</span>
                </div>
              </div>
            </div>
                         <div className="flex items-center gap-3 mt-6 lg:mt-0">
             </div>
          </div>
        </div>

       
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
         
          <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Members</p>
                                 <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active</p>
                                 <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.activeMembers}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Plants</p>
                                 <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalPlants}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiFeather className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Events</p>
                                 <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.upcomingEvents}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Done</p>
                                 <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                                 <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pendingTasks}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
         
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link
              to={`/plants/garden/${gardenId}/new`}
              className="group bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">Add Plants</h3>
                  <p className="text-green-100 text-sm">Record new plants</p>
                </div>
                <FiPlus className="w-6 h-6 sm:w-8 sm:h-8 text-green-100 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Link>

            <Link
              to={`/events/garden/${gardenId}/new`}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">Schedule Events</h3>
                  <p className="text-blue-100 text-sm">Plan activities</p>
                </div>
                <FiCalendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-100 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Link>

            <Link
              to={`/tasks/garden/${gardenId}/new`}
              className="group bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 sm:p-6 text-white hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">Create Tasks</h3>
                  <p className="text-yellow-100 text-sm">Assign work</p>
                </div>
                <FiCheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-100 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Link>

            <Link
              to={`/chat/garden/${gardenId}`}
              className="group bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">Community Chat</h3>
                  <p className="text-purple-100 text-sm">Connect</p>
                </div>
                <FiMessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-purple-100 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Plants ({stats.totalPlants})</h2>
                <div className="space-y-4">
                    {plants.map(plant => (
                    <div key={plant._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                        <h3 className="font-semibold text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-600">{plant.species}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedPlant(plant)} className="text-green-600 hover:text-green-700 text-sm font-medium">
                            View
                            </button>
                            <button onClick={() => handleDeletePlant(plant._id)} className="text-red-500 hover:text-red-700 p-1 rounded-full">
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-gray-100">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Tasks ({stats.totalTasks})</h2>
                <div className="space-y-4">
                    {tasks.map(task => (
                    <div key={task._id} className={`flex items-center justify-between p-4 rounded-xl ${task.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <div>
                        <h3 className={`font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                        <p className="text-sm text-gray-600 capitalize">{task.priority} Priority</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedTask(task)} className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                          View
                          </button>
                          {task.status !== 'completed' && (
                            <button onClick={() => handleCompleteTask(task._id)} className="text-green-600 hover:text-green-700 p-1 rounded-full">
                                <FiCheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
          </div>

          
            <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-gray-100 mt-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                                 {getUpcomingEvents().map(event => (
                  <div key={event._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                                             <p className="text-sm text-gray-600 mb-1 sm:mb-0">{event.attendees?.length || 0} attending</p>
                      <button onClick={() => setSelectedEvent(event)} className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
           
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                                 {getRecentActivity().map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <FiClock className="w-3 h-3 mr-1" />
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenDashboard;