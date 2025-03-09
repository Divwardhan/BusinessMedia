// ProfilesubE/ProfileSidebar.jsx
import React from 'react';

const ProfileSidebar = ({ organization }) => {
  return (
    <div className="w-1/6 border-r p-4 flex flex-col space-y-6">
      {/* Organization Logo */}
      <div className="h-24 w-24 bg-gray-200 rounded-md flex items-center justify-center">
        <span className="text-gray-500">Logo</span>
      </div>
      
      {/* Sidebar Sections with Dividers */}
      <div className="w-full h-px bg-gray-300"></div>
      
      {/* Organization Industry */}
      <div className="text-sm text-gray-700">
        <p className="mb-1 font-medium">Industry</p>
        <p>{organization.industry || 'Not specified'}</p>
      </div>
      
      <div className="w-full h-px bg-gray-300"></div>
      
      {/* Founding Date */}
      <div className="text-sm text-gray-700">
        <p className="mb-1 font-medium">Founded</p>
        <p>{organization.founded || 'Not specified'}</p>
      </div>
      
      <div className="w-full h-px bg-gray-300"></div>
      
      {/* Location */}
      <div className="text-sm text-gray-700">
        <p className="mb-1 font-medium">Location</p>
        <p>{organization.location || 'Not specified'}</p>
      </div>
      
      <div className="w-full h-px bg-gray-300"></div>
      
      {/* Website */}
      <div className="text-sm text-gray-700">
        <p className="mb-1 font-medium">Website</p>
        <p className="text-blue-600 truncate">{organization.website || 'Not specified'}</p>
      </div>
      
      {/* Like/Follow Button */}
      <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 transition">
        Like
      </button>
    </div>
  );
};

export default ProfileSidebar;