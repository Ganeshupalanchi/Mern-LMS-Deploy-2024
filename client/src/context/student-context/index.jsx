// import { fetchStudentViewCourseListService } from "@/services";
import { fetchStudentBoughtCourses } from "@/services";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../auth-context";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] =
    useState(null);
  const [studentBoughtCourseList, setStudentBoughtCoursesList] = useState([]);
  const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] =
    useState({});

  const [loadingState, setLoadingState] = useState(true);
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  //   console.log(freePreviewUrl);
  const fetchStudentCourses = async () => {
    try {
      const response = await fetchStudentBoughtCourses(auth?.user?.userId);
      if (response.success) {
        // console.log(response.data);
        setStudentBoughtCoursesList(response.data);
      }
    } catch (error) {
      setStudentBoughtCoursesList([]);
    }
  };
  useEffect(() => {
    if (auth?.user?.userId && auth?.user.role === "user") {
      fetchStudentCourses();
    }
  }, [auth]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null);
    }
  }, [location.pathname]);
  return (
    <StudentContext.Provider
      value={{
        studentViewCoursesList,
        setStudentViewCoursesList,
        loadingState,
        setLoadingState,
        studentViewCourseDetails,
        setStudentViewCourseDetails,
        studentBoughtCourseList,
        setStudentBoughtCoursesList,
        studentCurrentCourseProgress,
        setStudentCurrentCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
