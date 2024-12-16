import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
// import AuthProvider from "./context/auth-context";
import { Toaster } from "./components/ui/toaster";
import { InstructorProvider } from "./context/instructor-context";
import { StudentProvider } from "./context/student-context";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </InstructorProvider>
      <Toaster />
    </AuthProvider>
  </BrowserRouter>
);
