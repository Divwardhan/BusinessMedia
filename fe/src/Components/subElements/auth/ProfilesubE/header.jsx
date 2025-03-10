import React from 'react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ organization }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="p-6 border-b border-gray-300 dark:border-gray-700"
    >
      <div className="flex items-start gap-6">
        {/* Profile Image */}
        <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          {organization.profileImage ? (
            <img 
              src={organization.profileImage} 
              alt={organization.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Profile</span>
          )}
        </div>
        
        <div className="flex-1">
          {/* Top Row - CTAs */}
          <div className="flex mb-2 space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="h-8 w-16 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              Follow
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="h-8 w-24 border border-gray-300 dark:border-gray-600 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Message
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              className="h-8 w-16 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              More
            </motion.button>
          </div>

          {/* Description Box */}
          <div className="mb-4 text-gray-700 dark:text-gray-300">
            {organization.description || 'No description available.'}
          </div>

          {/* Members Section */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {(organization.displayedMembers || []).map((member, index) => (
                <img 
                  key={member.id || index} 
                  src={member.avatar || '/default-avatar.jpg'}
                  alt={member.name} 
                  className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 bg-white object-cover"
                />
              ))}
              {/* Placeholder if no members available */}
              {(!organization.displayedMembers || organization.displayedMembers.length === 0) && (
                <>
                  <div className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700"></div>
                </>
              )}
            </div>
            <div className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              + {organization.members || '0'} members with this organization
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
