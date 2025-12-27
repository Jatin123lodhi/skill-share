import { useEffect } from "react";
import useCourseStore from "../store/courseStore";
import { useNavigate } from "react-router-dom";

const CourseListing = () => {
  const { fetchCourses, courseData, isLoading, enrollInCourse, successMessage } = useCourseStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (courseData.length === 0) {
      fetchCourses();
    }
  }, [courseData, fetchCourses]);

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId)
  }

  // useEffect(() => {
  //   if(successMessage){
  //       const timer = setTimeout(() => {
  //           useCourseStore.setState({ successMessage: '' })
  //       },3000)

  //       return () => clearTimeout(timer);
  //   }
  // },[successMessage])

  return (
    <div>
      <h3 className="my-4">List of courses-</h3>
      {isLoading && <div>Loading...</div>}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{successMessage}</div>
      )}
      <div>
        {courseData?.map((course) => {
          return <div className=" border border-gray-300 max-w-100 p-2 flex flex-col gap-4" key={course._id}>
            <div>{course.title}</div>
            <button onClick={() => handleEnroll(course._id)} className="hover:bg-gray-300 cursor-pointer border border-gray-300 p-2">Enroll</button>
            <button onClick={() => navigate(`/${course._id}/reviews`)} className="hover:bg-gray-300 cursor-pointer border border-gray-300 p-2">Reviews</button>
          </div>;
        })}
      </div>
    </div>
  );
};

export default CourseListing;
