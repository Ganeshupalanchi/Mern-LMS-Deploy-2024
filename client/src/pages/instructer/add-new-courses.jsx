import CourseCurriculum from "@/components/instructor-view/courses/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/CourseLanding";
import CourseSettings from "@/components/instructor-view/courses/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { toast } from "@/hooks/use-toast";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddNewCourse() {
  const { auth } = useContext(AuthContext);
  const userData = auth?.user;
  // console.log(userData);
  const navigate = useNavigate();
  const {
    courseCurrisulumFormData,
    setCourseCurriculumFormData,
    courseLandingFormData,
    setCourseLandingFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);
  const params = useParams();
  // console.log(currentEditedCourseId);

  // console.log(params);

  const fetchCourseDetails = async () => {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );
    if (response.success) {
      // console.log(response);
      const setCourseFormData = Object.keys(courseLandingFormData).reduce(
        (acc, key) => {
          acc[key] = response?.data[key] || courseLandingFormData[key];
          return acc;
        },
        {}
      );
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  };

  useEffect(() => {
    if (params?.course_id) {
      setCurrentEditedCourseId(params.course_id);
    }
  }, [params?.course_id]);
  useEffect(() => {
    if (currentEditedCourseId && params?.course_id) {
      fetchCourseDetails();
    }
  }, [currentEditedCourseId]);

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  };

  const validateFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    let hasFreepreview = false;
    for (const item of courseCurrisulumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.freePreview) {
        hasFreepreview = true;
      }
    }
    return hasFreepreview;
  };
  // console.log(validateFormData());
  // console.log(courseCurrisulumFormData);

  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: userData.userId,
      instructorName: userData.username,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurrisulumFormData,
      isPublished: true,
    };
    // console.log(courseFinalFormData);
    const response = currentEditedCourseId
      ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
      : await addNewCourseService(courseFinalFormData);
    // return;
    // console.log(response);

    if (response?.success) {
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCourseLandingFormData(courseLandingInitialFormData);
      navigate(-1);
      if (!currentEditedCourseId) {
        toast({
          title: "New Course Added.",
        });
      } else {
        toast({
          title: "Course Updated.",
        });
        setCurrentEditedCourseId(null);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="justify-between flex mb-5">
        <h1 className="text-3xl font-extrabold ">
          {currentEditedCourseId ? "Edit Course" : "Create a new course"}
        </h1>
        <Button
          className="text-sm tracking-wider font-bold px-8"
          disabled={!validateFormData()}
          onClick={handleCreateCourse}
        >
          {currentEditedCourseId ? "Update" : "Submit"}
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList className="flex-col md:flex-row gap-3 md:gap-1 h-max items-start bg-blend-soft-light md:items-start md:bg-muted md:text-muted-foreground p-4 md:p-2">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
