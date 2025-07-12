import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, User, MessageSquare, Settings } from 'lucide-react';
import { Button } from '../common/Button';

export const Header: React.FC = () => {
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
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">SkillSwap</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              Login
            </Button>
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-4 border-t border-gray-800">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};