'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/server';

interface Review {
  id: string;
  placeId: string;
  rating: number;
  comment: string;
  authorName: string;
  createdAt: string;
}

interface ReviewSectionProps {
  placeId: string;
  initialReviews?: Review[];
}

export default function ReviewSection({ placeId, initialReviews = [] }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    authorName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            place_id: placeId,
            rating: newReview.rating,
            comment: newReview.comment,
            author_name: newReview.authorName,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setReviews([...reviews, data as Review]);
      setNewReview({ rating: 5, comment: '', authorName: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Reviews</h2>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{review.authorName}</span>
                <span className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Write a Review</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={newReview.authorName}
              onChange={(e) =>
                setNewReview({ ...newReview, authorName: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
} 