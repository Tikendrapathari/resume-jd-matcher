import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Results = ({ results }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const pieData = [
    { name: 'Matched Skills', value: results.resume_skills.length },
    { name: 'Missing Skills', value: results.missing_skills.length },
  ];

  const COLORS = ['#10b981', '#ef4444'];

  const barData = [
    { category: 'Skills', score: results.scores.skills },
    { category: 'Experience', score: results.scores.experience },
    { category: 'Education', score: results.scores.education },
    { category: 'Projects', score: results.scores.project },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
        <div className="text-center">
          <div className="relative inline-block">
            <svg className="w-48 h-48">
              <circle
                className="text-gray-700"
                strokeWidth="12"
                stroke="currentColor"
                fill="transparent"
                r="88"
                cx="96"
                cy="96"
              />
              <circle
                className={getScoreBg(results.total_match)}
                strokeWidth="12"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="88"
                cx="96"
                cy="96"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - results.total_match / 100)}`}
                transform="rotate(-90 96 96)"
              />
              <text
                x="96"
                y="96"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-4xl font-bold fill-current"
              >
                {Math.round(results.total_match)}%
              </text>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mt-4">Overall Match Score</h3>
          <p className={`text-lg font-semibold mt-2 ${getScoreColor(results.total_match)}`}>
            {results.recommendation}
          </p>
        </div>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <h4 className="text-xl font-bold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Detailed Analysis
          </h4>
          <div className="space-y-4">
            {barData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.category}</span>
                  <span className={getScoreColor(item.score)}>{item.score}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full rounded-full ${getScoreBg(item.score)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skills Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <h4 className="text-xl font-bold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-400" />
            Skills Analysis
          </h4>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span>Matched: {results.resume_skills.length} skills</span>
            </div>
            <div className="flex items-center text-sm">
              <XCircle className="w-4 h-4 text-red-400 mr-2" />
              <span>Missing: {results.missing_skills.length} skills</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Missing Skills */}
      {results.missing_skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <h4 className="text-xl font-bold mb-4 flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Skills to Develop
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.missing_skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30"
              >
                {skill}
              </motion.span>
            ))}
          </div>
          {results.experience_gap > 0 && (
            <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-300 text-sm">
                Experience gap: {results.experience_gap} years of additional experience recommended
              </p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Results;