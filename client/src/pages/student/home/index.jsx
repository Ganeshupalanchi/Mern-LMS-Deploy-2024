import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import banner from "/banner-img.png"; // we can direct import static file(img) from public like this
import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentHome() {
  const navigate = useNavigate();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
    studentBoughtCourseList,
  } = useContext(StudentContext);
  const fetchAllStudentViewCourses = async () => {
    const response = await fetchStudentViewCourseListService();
    if (response.success) {
      setLoadingState(false);
      setStudentViewCoursesList(response.data);
    }
  };

  const handleNavigateToCoursesPage = (getCurrentId) => {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/student/courses");
  };
  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);
  useEffect(() => {
    sessionStorage.removeItem("filters");
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-2">Learning thet gets you</h1>
          <p className="text-xl">
            Skills for your present and your feature. Get Started with US.
          </p>
        </div>
        <div className="lg:w-full lg:mb-0 mb-8">
          <img
            src={banner}
            alt=""
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((category) => (
            <Button
              className="justify-start"
              variant="outline"
              key={category.value}
              onClick={() => handleNavigateToCoursesPage(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8 ">
        <h2 className="text-2xl font-bold mb-6">Feature Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingState ? (
            <>
              <Skeleton className="h-[150px] w-[300px] rounded-xl" />
              <Skeleton className="h-[150px] w-[300px] rounded-xl" />
              <Skeleton className="h-[150px] w-[300px] rounded-xl" />
            </>
          ) : studentViewCoursesList && studentViewCoursesList.length ? (
            studentViewCoursesList.map((courseItem, i) => (
              <div
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
                key={i}
                onClick={() => {
                  const studentCourse =
                    studentBoughtCourseList.length &&
                    studentBoughtCourseList?.find(
                      (studentCourse) =>
                        studentCourse?.courseId === courseItem?._id
                    );

                  if (studentCourse) {
                    navigate(`/student/course-progress/${courseItem?._id}`);
                  } else {
                    navigate(`/student/course/details/${courseItem?._id}`);
                  }
                }}
              >
                <img
                  src={courseItem?.image}
                  width={"300"}
                  height={"150"}
                  alt=""
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-base">$ {courseItem?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-4xl font-extrabold">No Courses Found.</h1>
          )}
        </div>
      </section>
    </div>
  );
}
