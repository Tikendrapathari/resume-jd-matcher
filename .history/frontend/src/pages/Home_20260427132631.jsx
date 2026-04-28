import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import FileUploader from '../components/FileUploader';
import Results from '../components/Results';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Brain, TrendingUp, Shield } from 'lucide-react';

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
      });
      setResults(response.data);
      toast.success('Matching completed successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to match documents');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Brain, title: 'AI-Powered Matching', desc: 'Advanced NLP algorithms for accurate skill matching' },
    { icon: TrendingUp, title: 'Real-time Analysis', desc: 'Instant feedback with detailed breakdown' },
    { icon: Shield, title: 'Secure Processing', desc: 'Your data is encrypted and never stored' },
    { icon: Sparkles, title: 'Smart Insights', desc: 'Actionable recommendations for improvement' },
  ];

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-morphism p-4 text-center"
              >
                <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FileUploader
            onFileSelect={setResume}
            type="resume"
            label="Upload Resume"
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/plain': ['.txt'],
            }}
          />
          <FileUploader
            onFileSelect={setJobDescription}
            type="jd"
            label="Upload Job Description"
            accept={{
              'application/pdf': ['.pdf'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'text/plain': ['.txt'],
            }}
          />
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
            {loading ? 'Matching...' : 'Match Resume with Job Description'}
          </motion.button>
        </div>

        {/* Results Section */}
        {loading && <LoadingSpinner />}
        {results && !loading && <Results results={results} />}
      </div>
    </div>
  );
};

export default Home;