import { AuthContext } from "@/context/auth-context";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

export default function Unauthpage() {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  return (
    <>
      <h1>You don't have access to view this page.</h1>
      {auth && auth?.user?.role === "user" ? (
        <Link to={"/student"}>Go to home </Link>
      ) : (
        <Link to={"/instructor"}>Go to home </Link>
      )}
    </>
  );
}
