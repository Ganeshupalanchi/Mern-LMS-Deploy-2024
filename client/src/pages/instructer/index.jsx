import Courses from "@/components/instructor-view/courses/Courses";
import Dashboard from "@/components/instructor-view/Dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { BarChart, Book, BookAudio, LogOut } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";

export default function InstructerLayoutPage() {
  const { logoutUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  // console.log(activeTab);
  const {
    instructorCoursesList,
    setInstructorCoursesList,
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  } = useContext(InstructorContext);

  const fetchAllCourses = async () => {
    const response = await fetchInstructorCourseListService();
    if (response.success) {
      setInstructorCoursesList(response.data);
    }
  };
  useEffect(() => {
    fetchAllCourses();
    setCurrentEditedCourseId(null);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    setCourseLandingFormData(courseLandingInitialFormData);
  }, []);
  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <Dashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: BookAudio,
      label: "Courses",
      value: "courses",
      component: <Courses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                key={menuItem.value}
                className={`w-full justify-start mb-2`}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? logoutUser
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto ">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 ">Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent value={menuItem.value} key={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
