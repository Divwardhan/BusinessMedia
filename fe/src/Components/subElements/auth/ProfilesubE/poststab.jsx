import React from 'react';
import { motion } from 'framer-motion';

const PostsTab = ({ organization }) => {
  const hasPosts = organization.posts && organization.posts.length > 0;

  if (!hasPosts) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.3 }}
        className="text-center text-gray-500 dark:text-gray-400 py-12"
      >
        No posts available
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {organization.posts.map((post) => (
        <motion.div 
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm"
        >
          <h3 className="font-medium text-lg mb-2 text-gray-900 dark:text-gray-100">
            {post.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-400">
            {post.content}
          </p>
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {post.date ? (
              <>Posted on {new Date(post.date).toLocaleDateString()}</>
            ) : (
              'Date not available'
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PostsTab;
