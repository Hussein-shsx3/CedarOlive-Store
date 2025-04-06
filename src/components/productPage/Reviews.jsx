import React, { useState, useEffect } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  User,
  ThumbsUp,
  Edit,
  Trash,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../../api/review/reviewApi";
import { useGetCurrentUser } from "../../api/users/userApi";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Reviews = ({ productId, reviews: initialReviews = [] }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.review);
  const { data: user } = useGetCurrentUser();
  const cookies = new Cookies();
  const token = cookies.get("token");

  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [isEditing, setIsEditing] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    review: "",
  });

  // Update reviews when initialReviews changes
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // Reset form when closing
  useEffect(() => {
    if (!showForm) {
      setIsEditing(false);
      setEditingReviewId(null);
      setFormData({
        rating: 5,
        review: "",
      });
    }
  }, [showForm, user]);

  // Calculate review stats
  const calculateStats = () => {
    if (!reviews.length) return { average: 0, counts: [0, 0, 0, 0, 0] };

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    const counts = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        counts[5 - review.rating]++;
      }
    });

    return { average, counts };
  };

  const { average, counts } = calculateStats();

  // Get visible reviews
  const getVisibleReviews = () => {
    let sortedReviews = [...reviews];

    // Sort reviews
    switch (sortBy) {
      case "newest":
        sortedReviews.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        break;
      case "highest":
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    // Limit displayed reviews if not expanded
    if (!expanded && sortedReviews.length > 3) {
      return sortedReviews.slice(0, 3);
    }

    return sortedReviews;
  };

  const visibleReviews = getVisibleReviews();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarClick = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    const reviewData = {
      product: productId,
      rating: formData.rating,
      review: formData.review,
    };

    try {
      if (isEditing) {
        await dispatch(updateReview({ reviewId: editingReviewId, reviewData }));

        // Update local state
        setReviews(
          reviews.map((review) =>
            review._id === editingReviewId
              ? { ...review, ...reviewData }
              : review
          )
        );

        toast.success("Review updated successfully!");
      } else {
        const result = await dispatch(createReview(reviewData));

        // Add the new review to local state
        if (result.payload) {
          setReviews([...reviews, result.payload]);
        }

        toast.success("Review submitted successfully!");
      }

      // Reset form
      setFormData({
        rating: 5,
        review: "",
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingReviewId(null);
    } catch (err) {
      toast.error(err.message || "Failed to submit review. Please try again.");
    }
  };

  const handleEditReview = (review) => {
    setFormData({
      rating: review.rating || 5,
      review: review.review || "",
    });
    setIsEditing(true);
    setEditingReviewId(review._id);
    setShowForm(true);

    // Scroll to form
    window.scrollTo({
      top: document.querySelector(".reviews-container").offsetTop - 100,
      behavior: "smooth",
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await dispatch(deleteReview(reviewId));

        // Update local state
        setReviews(reviews.filter((review) => review._id !== reviewId));
        toast.success("Review deleted successfully!");
      } catch (err) {
        toast.error(
          err.message || "Failed to delete review. Please try again."
        );
      }
    }
  };

  const canManageReview = (review) => {
    if (!user) return false;
    return user._id === review.user._id || user.role === "admin";
  };

  const handleHelpful = (reviewId) => {
    // This would typically call an API to mark the review as helpful
    toast.info("Thank you for your feedback!");

    // For now just update UI
    setReviews(
      reviews.map((review) =>
        review._id === reviewId
          ? { ...review, helpfulCount: (review.helpfulCount || 0) + 1 }
          : review
      )
    );
  };

  return (
    <div className="reviews-container">
      {/* Display error if any */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6 flex items-center text-red-700">
          <AlertCircle size={20} className="mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Reviews Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={
                    star <= Math.round(average)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }
                  size={20}
                />
              ))}
            </div>
            <span className="text-2xl font-bold">{average.toFixed(1)}</span>
            <span className="text-gray-500 ml-2">
              out of 5 ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {/* Ratings breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => {
              const count = counts[5 - rating] || 0;
              const percentage = reviews.length
                ? (count / reviews.length) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">
                    {rating} star
                  </div>
                  <div className="w-full mx-2 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-4 text-center">
            Share your thoughts with other customers
          </p>
          <button
            onClick={() => {
              if (!token) {
                toast.error("You must be logged in to write a review");
                return;
              }
              setShowForm(true);
            }}
            disabled={loading}
            className="px-6 py-3 bg-primary text-black rounded-md hover:bg-yellow-200 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && token && (
        <div className="mb-12 p-6 bg-white border rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-4">
            {isEditing ? "Edit Review" : "Write a Review"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="mr-1 focus:outline-none"
                  >
                    <Star
                      className={
                        star <= formData.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                      size={24}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                name="review"
                value={formData.review}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-black rounded-md hover:bg-yellow-200 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Review" : "Submit Review"}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Reviews */}
      {reviews.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </h3>
            <div className="flex items-center">
              <label className="text-sm text-gray-600 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {visibleReviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={
                          star <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                        size={16}
                      />
                    ))}
                  </div>

                  {canManageReview(review) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Edit review"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-gray-500 hover:text-red-600"
                        aria-label="Delete review"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{review.user?.name || "Anonymous"}</span>
                    {review.user?.photo && (
                      <img
                        src={review.user.photo}
                        alt={review.user.name}
                        className="w-5 h-5 rounded-full ml-2"
                      />
                    )}
                  </div>
                  <span className="mx-2">•</span>
                  <span>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                  {review.updatedAt &&
                    review.updatedAt !== review.createdAt && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="italic">Edited</span>
                      </>
                    )}
                </div>

                <p className="text-gray-700 mb-3">{review.review}</p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="text-sm text-gray-500 flex items-center hover:text-gray-700"
                  >
                    <ThumbsUp size={14} className="mr-1" />
                    Helpful{" "}
                    {review.helpfulCount ? `(${review.helpfulCount})` : ""}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center mx-auto text-primary hover:text-primary-dark font-medium"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Show All Reviews ({reviews.length})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
