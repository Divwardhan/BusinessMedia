import React from 'react';
import { motion } from 'framer-motion';

const ProductsTab = ({ organization }) => {
  const hasProducts = organization.products && organization.products.length > 0;

  if (!hasProducts) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center text-gray-500 dark:text-gray-400 py-12"
      >
        No products available
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organization.products.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800"
        >
          {/* Product Image */}
          <div className="h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-gray-400 dark:text-gray-500">Product Image</span>
            )}
          </div>

          {/* Product Details */}
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1 text-gray-900 dark:text-gray-100">
              {product.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
              {product.description || 'No description available'}
            </p>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {product.price ? `$${product.price}` : 'Price not available'}
              </span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm transition-colors">
                Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductsTab;
