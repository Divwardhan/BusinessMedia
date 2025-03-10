import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileTabs from '../subElements/auth/ProfilesubE/Tabs';
import ProfileHeader from '../subElements/auth/ProfilesubE/header';
import ProfileSidebar from '../subElements/auth/ProfilesubE/Profilesidebar';
import { motion } from 'framer-motion';

const ProfileSkeleton = ({ organizationData }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const { orgId } = useParams();

  const organization = organizationData || {
    id: orgId,
    name: 'Organization Name',
    members: 0,
    displayedMembers: []
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Component */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-1/4"
          >
            <ProfileSidebar organization={organization} />
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-3/4"
          >
            {/* Profile Header Component */}
            <ProfileHeader organization={organization} />

            {/* Profile Tabs Component */}
            <ProfileTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              organization={organization} 
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSkeleton;
