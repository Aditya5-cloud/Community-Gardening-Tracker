import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSend, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const CommunityChat = () => {
  const { gardenId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // --- CHANGE: Made path relative ---
        const res = await axios.get(`/api/chat/garden/${gardenId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
    
    // Poll for new messages every 3 seconds to simulate real-time chat
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [gardenId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // --- CHANGE: Made path relative ---
      const res = await axios.post(`/api/chat/garden/${gardenId}`, { text: newMessage }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to={`/gardens/${gardenId}/dashboard`} className="p-2 rounded-full hover:bg-gray-200 mr-4">
            <FiArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <FiMessageSquare className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Community Chat</h1>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 bg-white rounded-2xl shadow-soft p-6 overflow-y-auto mb-6 border border-gray-100">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-start gap-3 ${msg.user._id === user._id ? 'justify-end' : ''}`}
                  >
                    {msg.user._id !== user._id && (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                        {msg.user.firstName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div className={`max-w-xs md:max-w-md ${msg.user._id === user._id ? 'text-right' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl ${msg.user._id === user._id ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                        <p>{msg.text}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5 px-2">
                        {msg.user._id !== user._id && <span className="font-semibold">{msg.user.firstName} {msg.user.lastName}</span>}
                        <span className="ml-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                     {msg.user._id === user._id && (
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">
                        {user.firstName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="bg-white rounded-2xl shadow-soft p-4 border border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full pl-4 pr-14 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;