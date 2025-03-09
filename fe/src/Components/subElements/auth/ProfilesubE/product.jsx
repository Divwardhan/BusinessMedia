// ProfilesubE/ProductsTab.jsx
import React from 'react';

const ProductsTab = ({ organization }) => {
  // Check if products data exists and has elements
  const hasProducts = organization.products && organization.products.length > 0;
  
  if (!hasProducts) {
    return (
      <div className="text-center text-gray-500 py-12">
        No products available
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {organization.products.map((product) => (
        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-40 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">Product Image</span>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">{product.price}</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsTab;