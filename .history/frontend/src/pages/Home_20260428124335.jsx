import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleMatch = async () => {
    if (!resume || !jobDescription) {
      toast.error('Please upload both resume and job description');
      return;
    }

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/match', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000, // 30 second timeout
      });
      
      setResults(response.data);
      toast.success('Match completed successfully!');
    } catch (error) {
      console.error('Error details:', error);
      if (error.response) {
        toast.error(error.response.data?.error || 'Failed to match documents');
      } else if (error.request) {
        toast.error('Cannot connect to backend. Make sure backend is running on port 5000');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resume-Job Matcher
          </h1>
          <p className="text-xl text-gray-300">
            Find the perfect match between candidates and job requirements using AI
          </p>
        </motion.div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <label className="block text-lg font-semibold text-white mb-3">
              📄 Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full p-3 bg-gray-700 rounded-lg text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {resume && (
              <p className="text-green-400 text-sm mt-2">
                ✓ {resume.name} ({(resume.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Job Description Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <label className="block text-lg font-semibold text-white mb-3">
              💼 Upload Job Description
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setJobDescription(e.target.files[0])}
              className="w-full p-3 bg-gray-700 rounded-lg text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {jobDescription && (
              <p className="text-green-400 text-sm mt-2">
                ✓ {jobDescription.name} ({(jobDescription.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
        </div>

        {/* Match Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleMatch}
            disabled={!resume || !jobDescription || loading}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              !resume || !jobDescription || loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            {loading ? '⏳ Matching...' : '🎯 Match Resume with Job Description'}
          </button>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-300 mt-4">Analyzing documents...</p>
          </div>
        )}

        {results && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Score Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="text-center">
                <div className="text-7xl font-bold text-blue-400 mb-4">
                  {results.total_match}%
                </div>
                <h3 className="text-2xl font-bold mb-2">Overall Match Score</h3>
                <p className="text-lg text-gray-300">{results.recommendation}</p>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {results.skill_score}%
                </div>
                <p className="text-gray-300">Skills Match</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {results.experience_score}%
                </div>
                <p className="text-gray-300">Experience Match</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {results.similarity_score}%
                </div>
                <p className="text-gray-300">Text Similarity</p>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h4 className="text-xl font-bold mb-4">🔧 Skills Analysis</h4>
              
              <div className="mb-4">
                <p className="text-green-400 font-semibold mb-2">✓ Your Skills ({results.resume_skills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {results.resume_skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-blue-400 font-semibold mb-2">📋 Required Skills ({results.required_skills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {results.required_skills?.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {results.missing_skills?.length > 0 && (
                <div>
                  <p className="text-red-400 font-semibold mb-2">⚠️ Missing Skills ({results.missing_skills.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {results.missing_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;