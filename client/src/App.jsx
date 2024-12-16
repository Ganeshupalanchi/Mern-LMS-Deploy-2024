import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import AuthPage from "./pages/auth";
import Unauthpage from "./pages/unauth-page/Unauthpage";
import NotFound from "./pages/not-found/NotFound";
import StudentHome from "./pages/student/home";
import StudentViewCommonLayout from "./components/student-view/layout";
import StudentViewCoursesPage from "./pages/student/cources";
import CheckAuth from "./components/common/CheckAuth";
import { Skeleton } from "./components/ui/skeleton";
import { RotatingLines } from "react-loader-spinner";
import InstructerLayoutPage from "./pages/instructer";
import AddNewCourse from "./pages/instructer/add-new-courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaymentReturnPage from "./pages/student/PaymentReturn";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentCourseProgressPage from "./pages/student/course-progress";
import PaymentCancel from "./pages/student/PaymentCancel";

function App() {
  const { auth, authLoading } = useContext(AuthContext);

  // Custom Route Wrapper for Authenticated Routes
  const AuthRoute = ({ children, role }) => {
    const { authenticate, user } = auth;

    if (authLoading) {
      return (
        <div className="flex items-center justify-center h-[100vh]">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      ); // Replace with a proper loader if needed
    }

    if (!authenticate) {
      return <Navigate to="/auth" />;
    }

    if (role && user.role !== role) {
      return <Navigate to="/unauth-page" />;
    }

    return children;
  };
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route
        path="/"
        element={
          <CheckAuth authenticate={auth.authenticate} user={auth.user}>
            <AuthPage />
          </CheckAuth>
        }
      />
      <Route
        path="/auth"
        element={
          <CheckAuth authenticate={auth.authenticate} user={auth.user}>
            <AuthPage />
          </CheckAuth>
        }
      />

      {/* Instructor Routes */}
      <Route
        path="/instructor"
        element={
          <AuthRoute role="instructor">
            <InstructerLayoutPage />
          </AuthRoute>
        }
      ></Route>
      <Route
        path="/instructor/create-new-course"
        element={
          <AuthRoute role="instructor">
            <AddNewCourse />
          </AuthRoute>
        }
      ></Route>
      <Route
        path={`/instructor/edit-course/:course_id`}
        element={
          <AuthRoute role="instructor">
            <AddNewCourse />
          </AuthRoute>
        }
      ></Route>

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <AuthRoute role="user">
            <StudentViewCommonLayout />
          </AuthRoute>
        }
      >
        <Route path="" element={<StudentHome />} />
        <Route path="home" element={<StudentHome />} />
        <Route path="courses" element={<StudentViewCoursesPage />} />
        <Route path="student-courses" element={<StudentCoursesPage />} />
        <Route
          path="course/details/:course_id"
          element={<StudentViewCourseDetailsPage />}
        />
        <Route
          path="course-progress/:course_id"
          element={<StudentCourseProgressPage />}
        />
      </Route>
      <Route path="/payment-return" element={<PaymentReturnPage />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />

      {/* Not Found Route */}
      <Route path="/*" element={<NotFound />} />
      <Route path="/unauth-page" element={<Unauthpage />} />
    </Routes>
  );
}

export default App;
