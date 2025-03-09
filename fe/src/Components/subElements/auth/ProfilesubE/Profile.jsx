import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProfileSkeleton from '../../../skeleton/Profileskeleton';

const Profile = () => {
  const { orgId } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch organization data
    const fetchOrganizationData = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we're using mock data
        
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching organization data:', err);
        setError('Failed to load organization data');
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return <ProfileSkeleton organizationData={organization} />;
};

export default Profile;