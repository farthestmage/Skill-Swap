import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, User, MessageSquare, Settings, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotlightButton } from '../ui/SpButton';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/browse', label: 'Browse Skills', icon: Users },
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/swaps', label: 'My Swaps', icon: MessageSquare },
    { path: '/admin', label: 'Admin Panel', icon: Settings }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center gap-2 group"
          >
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-br from-white to-gray-300 rounded-lg flex items-center justify-center shadow-lg"
            >
              <Users className="h-5 w-5 text-black" />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
            >
              SkillSwap
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="relative group"
                  >
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.path)
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {Icon && (
                        <motion.div
                          animate={isActive(item.path) ? { rotate: 360 } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="h-4 w-4" />
                        </motion.div>
                      )}
                      {item.label}
                      
                      {/* Active indicator */}
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg -z-10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <motion.div 
            className="hidden md:flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SpotlightButton text='Login' />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SpotlightButton text='Sign Up' />
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800/50 text-white hover:bg-gray-700/50 transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <motion.div className="py-4 space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -50, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {Icon && (
                          <motion.div
                            animate={isActive(item.path) ? { rotate: 360 } : {}}
                            transition={{ duration: 0.5 }}
                          >
                            <Icon className="h-5 w-5" />
                          </motion.div>
                        )}
                        <span>{item.label}</span>
                        {isActive(item.path) && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "3px" }}
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Auth Buttons */}
                <motion.div 
                  className="pt-4 border-t border-gray-800/50 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <SpotlightButton text='Login' />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <SpotlightButton text='Sign Up' />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating orbs background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.header>
  );
};