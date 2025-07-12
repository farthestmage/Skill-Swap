import React from 'react';
import { Users, Mail, Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white">SkillSwap</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Connect with others to exchange skills and knowledge. Learn something new while teaching what you know best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Skills</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-white transition-colors">My Profile</a></li>
              <li><a href="/swaps" className="text-gray-400 hover:text-white transition-colors">My Swaps</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Mail className="h-4 w-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Github className="h-4 w-4 text-gray-400" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                <Twitter className="h-4 w-4 text-gray-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 SkillSwap Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};