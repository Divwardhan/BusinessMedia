// ProfilesubE/ReviewsTab.jsx
import React from 'react';

const ReviewsTab = ({ organization }) => {
  // Check if reviews data exists and has elements
  const hasReviews = organization.reviews && organization.reviews.length > 0;
  
  if (!hasReviews) {
    return (
      <div className="text-center text-gray-500 py-12">
        No reviews available
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {organization.reviews.map((review) => (
        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
            <div>
              <div className="font-medium">{review.authorName}</div>
              <div className="text-yellow-500">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>
          </div>
          <p className="text-gray-700">{review.content}</p>
          <div className="mt-3 text-sm text-gray-500">
            Posted on {review.date}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsTab;