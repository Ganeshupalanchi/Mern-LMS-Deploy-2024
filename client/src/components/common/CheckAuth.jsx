import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function CheckAuth({ authenticate, user, children }) {
  const location = useLocation();
  const navigage = useNavigate();
  useEffect(() => {
    if (!authenticate) {
      navigage("/auth");
    }
  }, []);

  if (
    authenticate &&
    (location.pathname.includes("auth") || location.pathname.includes("/"))
  ) {
    if (user.role === "instructor") {
      return <Navigate to={"/instructor"} replace="true" />;
    } else {
      return <Navigate to={"/student"} replace="true" />;
    }
  }
  return children;
}
