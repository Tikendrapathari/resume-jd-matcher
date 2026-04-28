import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, FileCheck, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  // Mock data - in production, fetch from API
  const matchData = [
    { month: 'Jan', matches: 65 },
    { month: 'Feb', matches: 78 },
    { month: 'Mar', matches: 82 },
    { month: 'Apr', matches: 88 },
    { month: 'May', matches: 94 },
    { month: 'Jun', matches: 102 },
  ];

  const skillDistribution = [
    { skill: 'Python', count: 45 },
    { skill: 'SQL', count: 38 },
    { skill: 'ML', count: 32 },
    { skill: 'Deep Learning', count: 28 },
    { skill: 'NLP', count: 25 },
  ];

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Track your matching performance and insights</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: 'Total Candidates', value: '1,234', change: '+12%', color: 'blue' },
            { icon: FileCheck, label: 'Matches Made', value: '892', change: '+8%', color: 'green' },
            { icon: TrendingUp, label: 'Avg Match Rate', value: '76%', change: '+5%', color: 'purple' },
            { icon: Award, label: 'Top Score', value: '98%', change: '+2%', color: 'orange' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                <span className="text-green-400 text-sm">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-6"
          >
            <h3 className="text-xl font-bold mb-4">Monthly Matches</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={matchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line type="monotone" dataKey="matches" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-morphism p-6"
          >
            <h3 className="text-xl font-bold mb-4">Top Skills in Demand</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="skill" type="category" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="count" fill="#8B5CF6" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;