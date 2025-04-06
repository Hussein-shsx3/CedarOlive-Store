import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetAllReviews,
  createReview,
  deleteReview,
  updateReview,
} from "../../api/review/reviewApi";
import { Star, Edit, Trash2 } from "lucide-react";

const ReviewForm = ({ productId, reviewToEdit, setReviewToEdit }) => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.review);
  const [formData, setFormData] = useState({
    rating: reviewToEdit ? reviewToEdit.rating : 5,
    review: reviewToEdit ? reviewToEdit.review : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (reviewToEdit) {
      dispatch(
        updateReview({
          reviewId: reviewToEdit._id,
          ...formData,
        })
      );
      setReviewToEdit(null);
    } else {
      dispatch(
        createReview({
          productId,
          ...formData,
        })
      );
    }

    // Reset form after submission
    if (success || !loading) {
      setFormData({ rating: 5, review: "" });
    }
  };

  const handleCancel = () => {
    setReviewToEdit(null);
    setFormData({ rating: 5, review: "" });
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-medium mb-4">
        {reviewToEdit ? "Edit Your Review" : "Write a Review"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Rating</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className="text-xl mr-1 focus:outline-none"
              >
                {star <= formData.rating ? (
                  <Star className="text-yellow-400 fill-yellow-400" size={20} />
                ) : (
                  <Star className="text-yellow-400" size={20} />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Your Review</label>
          <textarea
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows="4"
            className="w-full border p-2 rounded"
            required
          ></textarea>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-black px-6 py-3 hover:bg-gray-200"
          >
            {loading
              ? "Submitting..."
              : reviewToEdit
              ? "Update Review"
              : "Submit Review"}
          </button>

          {reviewToEdit && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black px-6 py-3 hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const ReviewItem = ({ review, currentUserId, onEdit, onDelete }) => {
  const isAuthor = review.user && review.user._id === currentUserId;

  // Format date manually instead of using date-fns
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="border-b border-gray-200 py-6">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          {review.user?.photo ? (
            <img
              src={review.user.photo}
              alt={review.user.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
              {review.user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <h4 className="font-medium">{review.user?.name || "Anonymous"}</h4>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < review.rating ? (
                    <Star
                      className="text-yellow-400 fill-yellow-400"
                      size={16}
                    />
                  ) : (
                    <Star className="text-yellow-400" size={16} />
                  )}
                </span>
              ))}
              <span className="text-sm text-gray-500 ml-2">
                {review.createdAt ? formatDate(review.createdAt) : ""}
              </span>
            </div>
          </div>
        </div>

        {isAuthor && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(review)}
              className="text-gray-500 hover:text-blue-500"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-700">{review.review}</p>
    </div>
  );
};

const Reviews = ({ productId }) => {
  const dispatch = useDispatch();
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const { data: reviews, isLoading, isError } = useGetAllReviews(productId);

  // Mock user ID for testing - in a real app, get this from auth state
  const currentUserId = "user123"; // Replace with actual user ID from auth

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    window.scrollTo({
      top: document.getElementById("review-form").offsetTop - 100,
      behavior: "smooth",
    });
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      dispatch(deleteReview(reviewId));
    }
  };

  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="my-12">
      <h2 className="text-2xl font-medium mb-6">Customer Reviews</h2>

      {reviews && reviews.length > 0 ? (
        <div className="mb-8 flex items-center">
          <div className="mr-4">
            <span className="text-3xl font-semibold">
              {calculateAverageRating()}
            </span>
            <span className="text-gray-500">/5</span>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.round(calculateAverageRating()) ? (
                  <Star className="text-yellow-400 fill-yellow-400" size={24} />
                ) : (
                  <Star className="text-yellow-400" size={24} />
                )}
              </span>
            ))}
          </div>
          <span className="ml-4 text-gray-500">
            Based on {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </div>
      ) : (
        <p className="text-gray-500 mb-8">
          No reviews yet. Be the first to review this product!
        </p>
      )}

      <div id="review-form">
        <ReviewForm
          productId={productId}
          reviewToEdit={reviewToEdit}
          setReviewToEdit={setReviewToEdit}
        />
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-medium mb-6">All Reviews</h3>
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : isError ? (
          <p className="text-red-500">Error loading reviews</p>
        ) : reviews && reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                currentUserId={currentUserId}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
