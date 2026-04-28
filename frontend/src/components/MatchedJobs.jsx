import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Star } from 'lucide-react';

const MatchedJobs = ({ jobs }) => {
  const getStars = (score) => {
    const stars = Math.floor(score / 20);
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-blue-400" />
        Matching Job Opportunities
      </h3>
      
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-lg font-semibold text-white">{job.title}</h4>
              <p className="text-gray-400 text-sm">{job.company}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                {getStars(job.matchScore)}
              </div>
              <span className="text-sm text-blue-400">{job.matchScore}% Match</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              {job.salary}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {job.postedDate}
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-3">{job.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className={`px-2 py-1 rounded-md text-xs ${
                  job.matchedSkills.includes(skill)
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchedJobs;