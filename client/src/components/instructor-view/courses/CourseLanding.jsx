import CommonForm from "@/components/common";
import FormControls from "@/components/common/FormControls";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import React, { useContext } from "react";

export default function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  // console.log(courseLandingFormData);

  return (
    <Card>
      <CardHeader>Course Landing Page</CardHeader>
      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
}
