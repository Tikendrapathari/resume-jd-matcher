import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, LayoutDashboard, History, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [hovered, setHovered] = useState(null);

  const navItems = [
    { path: '/', icon: FileText, label: 'Matcher' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="glass-morphism fixed top-0 left-0 right-0 z-50 px-6 py-4 mx-4 mt-4"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ResumeMatcher AI
            </h1>
            <p className="text-xs text-gray-400">Smart Candidate Screening</p>
          </div>
        </Link>

        <div className="flex space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {hovered === item.path && !isActive && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-white/5 rounded-xl -z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;