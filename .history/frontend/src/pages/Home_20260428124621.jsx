import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, FileText, TrendingUp, Award, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (type, file) => {
    if (type === 'resume') {
      setResume(file);
    } else {
      setJobDescription(file);
    }
  };

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
        timeout: 30000,
      });
      
      setResults(response.data);
      toast.success('Match completed successfully!');
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <div className="pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Resume-Job Matcher
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Find the perfect match between candidates and job requirements using AI
          </p>
        </motion.div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <label className="block text-lg font-semibold text-white mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-400" />
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileChange('resume', e.target.files[0])}
              className="w-full p-3 bg-gray-700 rounded-lg text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {resume && (
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {resume.name} ({(resume.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </motion.div>

          {/* Job Description Upload */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <label className="block text-lg font-semibold text-white mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-purple-400" />
              Upload Job Description
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileChange('job', e.target.files[0])}
              className="w-full p-3 bg-gray-700 rounded-lg text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
            />
            {jobDescription && (
              <div className="mt-3 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                <p className="text-green-400 text-sm flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {jobDescription.name} ({(jobDescription.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Match Button */}
        <div className="text-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMatch}
            disabled={!resume || !jobDescription || loading}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
              !resume || !jobDescription || loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Matching...
              </span>
            ) : (
              'Match Resume with Job Description'
            )}
          </motion.button>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-300 mt-4">Analyzing documents with AI...</p>
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
                      className="text-4xl font-bold fill-current text-white"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.skill_score)}`}>
                  {Math.round(results.skill_score)}%
                </div>
                <p className="text-gray-300">Skills Match</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.experience_score)}`}>
                  {Math.round(results.experience_score)}%
                </div>
                <p className="text-gray-300">Experience Match</p>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-700">
                <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.similarity_score)}`}>
                  {Math.round(results.similarity_score)}%
                </div>
                <p className="text-gray-300">Text Similarity</p>
              </div>
            </div>

            {/* Skills Analysis */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h4 className="text-xl font-bold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-400" />
                Skills Analysis
              </h4>
              
              {results.resume_skills && results.resume_skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-green-400 font-semibold mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Your Skills ({results.resume_skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.resume_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.required_skills && results.required_skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-blue-400 font-semibold mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Required Skills ({results.required_skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.required_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.missing_skills && results.missing_skills.length > 0 && (
                <div>
                  <p className="text-red-400 font-semibold mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Missing Skills ({results.missing_skills.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.missing_skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.experience_gap > 0 && (
                <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-300 text-sm flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Experience gap: {results.experience_gap} years of additional experience recommended
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Add Briefcase icon since it was missing
const Briefcase = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

export default Home;