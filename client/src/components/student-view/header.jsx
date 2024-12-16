import { GraduationCap, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

export default function StudentViewCommonHeader() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/student/student-courses");
  };
  return (
    <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-50">
      <div className="flex items-center space-x-4">
        <Link to="/student" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-4 " />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS Learn
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("student/courses")
                ? null
                : navigate("/student/courses");
            }}
            className="text-sm md:text-base font-medium"
          >
            Explore Course
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleClick}
          >
            <span className="font-extrabold  md:text-xl text-sm">
              My Courses
            </span>
            <TvMinimalPlay className="w-8 h-8 " />
          </div>
          <Button onClick={logoutUser}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}
