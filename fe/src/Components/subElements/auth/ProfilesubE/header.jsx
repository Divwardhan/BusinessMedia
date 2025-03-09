// ProfilesubE/ProfileHeader.jsx
import React from 'react';

const ProfileHeader = ({ organization }) => {
  return (
    <div className="p-6 border-b">
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Profile</span>
        </div>
        
        <div className="flex-1">
          {/* Top Row - CTAs */}
          <div className="flex mb-2">
            {/* Placeholder Boxes from Wireframe */}
            <div className="flex space-x-4">
              <div className="h-8 w-16 border border-gray-300"></div>
              <div className="h-8 w-24 border border-gray-300"></div>
              <div className="h-8 w-16 border border-gray-300"></div>
            </div>
          </div>
          
          {/* Description Box */}
          <div className="h-8 w-full border border-gray-300 mb-4"></div>
          
          {/* Members Section */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {(organization.displayedMembers || []).map((member, index) => (
                <div 
                  key={member.id || index} 
                  className="h-6 w-6 rounded-full border border-gray-300 bg-white"
                ></div>
              ))}
              {/* If no displayed members are available, show placeholders */}
              {(!organization.displayedMembers || organization.displayedMembers.length === 0) && (
                <>
                  <div className="h-6 w-6 rounded-full border border-gray-300 bg-white"></div>
                  <div className="h-6 w-6 rounded-full border border-gray-300 bg-white"></div>
                  <div className="h-6 w-6 rounded-full border border-gray-300 bg-white"></div>
                </>
              )}
            </div>
            <div className="ml-2 text-sm text-gray-600">
              + {organization.members || '0'} members with this organization
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;