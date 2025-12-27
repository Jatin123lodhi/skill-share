import { useParams } from "react-router-dom";
import useCourseStore from "../store/courseStore";
import { useEffect, type FormEvent } from "react";
import { useForm } from "../hooks/useForm";

const CourseReview = () => {
  const { formData, handleChange } = useForm({
    comment: "",
    rating: 1,
  });

  // extract the courseId and fetch reviews
  const { courseId } = useParams();

  const { fetchCourseReviews, courseData, isLoading, reviewData, sendReview } =
    useCourseStore();

  const course = courseData.find((c) => c._id === courseId);

  useEffect(() => {
    if (courseId) {
      fetchCourseReviews(courseId);
    }
  }, [courseId, fetchCourseReviews]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(courseId)
    sendReview({courseId, ...formData});
  };

  return (
    <div className="p-3">
      <h3>Reviews:</h3>
      {isLoading && <div>Loading...</div>}
      <h3>{course?.title}</h3>

      <div>
        {reviewData.map((review) => {
          return (
            <div key={review._id}>
              {review.comment} - {review.rating}
            </div>
          );
        })}
      </div>

      <form
        className="flex flex-col gap-3 mt-4"
        title="review-form"
        onSubmit={handleSubmit}
      >
        <input
          className="p-2 border border-gray-300"
          name="comment"
          value={formData.comment}
          placeholder="Enter some feedback"
          onChange={handleChange}
        />

        <div className="flex w-full items-center gap-2">
          <label className="shrink-0">Rate (1 to 5):</label>
          <input
            min={1}
            max={5}
            className="p-2 border border-gray-300 w-full"
            name="rating"
            value={formData.rating}
            type="number"
            onChange={handleChange}
          />
        </div>
        <button
          className="cursor-pointer p-2 border border-gray-300 hover:border-gray-300"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CourseReview;
