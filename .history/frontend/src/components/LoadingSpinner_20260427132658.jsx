import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-800 rounded-2xl p-8 text-center"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-4 text-white font-semibold">Analyzing documents...</p>
        <p className="text-sm text-gray-400 mt-2">Using AI to find the best match</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;