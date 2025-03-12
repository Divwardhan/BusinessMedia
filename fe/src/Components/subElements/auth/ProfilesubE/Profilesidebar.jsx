import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ProfileSidebar = ({ organization }) => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className={`w-1/4 h-full p-6 border-r ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}>
      {/* Toggle Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Logo */}
      <div className="h-28 w-28 bg-gray-700 rounded-md flex items-center justify-center">
        <span className="text-gray-400">Logo</span>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-700" />

      {/* Info Sections */}
      <div className="space-y-4">
        <div className="text-sm">
          <p className="text-gray-400 uppercase font-semibold mb-1">Industry</p>
          <p className="text-gray-300">{organization.industry || 'Not specified'}</p>
        </div>

        <div className="text-sm">
          <p className="text-gray-400 uppercase font-semibold mb-1">Founded</p>
          <p className="text-gray-300">{organization.founded || 'Not specified'}</p>
        </div>

        <div className="text-sm">
          <p className="text-gray-400 uppercase font-semibold mb-1">Location</p>
          <p className="text-gray-300">{organization.location || 'Not specified'}</p>
        </div>

        <div className="text-sm">
          <p className="text-gray-400 uppercase font-semibold mb-1">Website</p>
          <a
            href={organization.website || '#'}
            className="text-blue-400 hover:underline truncate block"
          >
            {organization.website || 'Not specified'}
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 h-px bg-gray-700" />

      {/* Like Button */}
      <button className="w-full py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-500 transition">
        Like
      </button>
    </div>
  );
};

export default ProfileSidebar;
