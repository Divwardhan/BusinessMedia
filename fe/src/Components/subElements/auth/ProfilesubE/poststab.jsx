// ProfilesubE/PostsTab.jsx
import React from 'react';

const PostsTab = ({ organization }) => {
  // Check if posts data exists and has elements
  const hasPosts = organization.posts && organization.posts.length > 0;
  
  if (!hasPosts) {
    return (
      <div className="text-center text-gray-500 py-12">
        No posts available
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {organization.posts.map((post) => (
        <div key={post.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-lg mb-2">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
          <div className="mt-4 text-sm text-gray-500">
            Posted on {post.date}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostsTab;