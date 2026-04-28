import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Clock, Search, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item =>
    item.resume_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jd_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Match History
          </h1>
          <p className="text-gray-400 mt-2">View all your previous resume-job matches</p>
        </motion.div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by resume or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-morphism p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{item.resume_name}</h3>
                      <span className="text-gray-400">vs</span>
                      <h3 className="text-lg font-semibold text-white">{item.jd_name}</h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-400">
                        Skills Matched: {item.skills_matched}/{item.total_skills}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(item.match_score)}`}>
                      {Math.round(item.match_score)}%
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Match Score</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No matching history found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;