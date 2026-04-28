import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BookOpen, Target, Award } from 'lucide-react';

const SkillGap = ({ missingSkills, recommendations }) => {
  const getRecommendationColor = (type) => {
    switch(type) {
      case 'course': return 'from-blue-500 to-cyan-500';
      case 'project': return 'from-purple-500 to-pink-500';
      case 'certification': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
        <h3 className="text-xl font-bold mb-4 flex items-center text-red-400">
          <TrendingUp className="w-5 h-5 mr-2" />
          Skill Gap Analysis
        </h3>
        
        {missingSkills.length > 0 ? (
          <>
            <p className="text-gray-300 mb-3">
              You're missing {missingSkills.length} key skills required for this role:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {missingSkills.map((skill, index) => (
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
          </>
        ) : (
          <div className="flex items-center space-x-2 text-green-400">
            <Award className="w-5 h-5" />
            <span>Great! You have all the required skills!</span>
          </div>
        )}
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-bold mb-4 flex items-center text-blue-400">
            <BookOpen className="w-5 h-5 mr-2" />
            Learning Recommendations
          </h3>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getRecommendationColor(rec.type)} p-4 rounded-lg`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                    <p className="text-sm text-white/80">{rec.description}</p>
                    {rec.duration && (
                      <p className="text-xs text-white/60 mt-2">⏱ {rec.duration}</p>
                    )}
                  </div>
                  <a
                    href={rec.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                  >
                    Learn →
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGap;