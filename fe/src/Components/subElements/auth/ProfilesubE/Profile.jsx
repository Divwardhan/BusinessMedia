import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileSkeleton from '../../../skeleton/Profileskeleton';
import { motion } from 'framer-motion';

const Profile = () => {
  const { orgId } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const mockData = {
          id: orgId || '123',
          name: 'Acme Corporation',
          description: 'Leading provider of business solutions',
          industry: 'Technology',
          founded: '2010',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          members: 69,
          displayedMembers: [
            { id: 1, name: 'John Doe', avatar: '/avatar1.jpg' },
            { id: 2, name: 'Jane Smith', avatar: '/avatar2.jpg' },
            { id: 3, name: 'Mike Johnson', avatar: '/avatar3.jpg' }
          ],
          posts: [],
          products: [],
          reviews: []
        };

        setOrganization(mockData);
      } catch (err) {
        console.error('Error fetching organization data:', err);
        setError('Failed to load organization data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [orgId, retry]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <div className="mt-4 text-xl text-gray-700 dark:text-gray-300">Loading...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900"
      >
        <div className="flex flex-col items-center">
          <div className="text-xl text-red-600">{error}</div>
          <button
            onClick={() => setRetry(prev => prev + 1)}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return <ProfileSkeleton organizationData={organization} />;
};

export default Profile;
