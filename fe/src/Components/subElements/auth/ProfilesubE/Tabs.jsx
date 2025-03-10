import React from 'react';
import PostsTab from './poststab';
import ProductsTab from './product';
import ReviewsTab from './reviews';

const ProfileTabs = ({ activeTab, onTabChange, organization }) => {
  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b">
        <button 
          className={`px-6 py-3 text-lg font-medium border-r ${activeTab === 'posts' ? 'text-black' : 'text-gray-500'}`}
          onClick={() => onTabChange('posts')}
        >
          Posts
        </button>
        <button 
          className={`px-6 py-3 text-lg font-medium border-r ${activeTab === 'products' ? 'text-black' : 'text-gray-500'}`}
          onClick={() => onTabChange('products')}
        >
          Products
        </button>
        <button 
          className={`px-6 py-3 text-lg font-medium ${activeTab === 'reviews' ? 'text-black' : 'text-gray-500'}`}
          onClick={() => onTabChange('reviews')}
        >
          reviews
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="p-4 min-h-[300px]">
        {activeTab === 'posts' && <PostsTab organization={organization} />}
        {activeTab === 'products' && <ProductsTab organization={organization} />}
        {activeTab === 'reviews' && <ReviewsTab organization={organization} />}
      </div>
    </div>
  );
};

export default ProfileTabs;