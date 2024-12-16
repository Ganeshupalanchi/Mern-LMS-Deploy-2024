import React, { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";
import StudentViewCommonHeader from "./header";

export default function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    <div>
      {location.pathname.includes("/course-progress") ? null : (
        <StudentViewCommonHeader />
      )}
      <Outlet />
    </div>
  );
}
