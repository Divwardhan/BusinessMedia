import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileTabs from '../subElements/auth/ProfilesubE/Tabs';
import ProfileHeader from '../subElements/auth/ProfilesubE/header';
import ProfileSidebar from '../subElements/auth/ProfilesubE/Profilesidebar';

const ProfileSkeleton = ({ organizationData }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const { orgId } = useParams();
  
  // If data is passed as prop, use it; otherwise this could be a loading state component
  const organization = organizationData || {
    id: orgId,
    name: 'Organization Name',
    members: 0,
    displayedMembers: []
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex">
          {/* Sidebar Component */}
          <ProfileSidebar organization={organization} />
          
          {/* Main Content Area */}
          <div className="w-5/6">
            {/* Profile Header Component */}
            <ProfileHeader organization={organization} />
            
            {/* Profile Tabs Component */}
            <ProfileTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              organization={organization} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;