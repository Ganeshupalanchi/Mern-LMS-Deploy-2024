import MediaProgressbar from "@/components/common/MediaProgressbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { X } from "lucide-react";
import React, { useContext } from "react";

export default function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  // console.log(courseLandingFormData);

  const handleImageUpload = async (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        // console.log(response);
        if (response.success) {
          setMediaUploadProgress(false);
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className=""></div>
      <CardContent>
        {mediaUploadProgress ? (
          <div className="flex flex-col gap-3 ">
            <Label>Uploading Course Image...</Label>
            <Skeleton className="h-96  rounded-xl" />
          </div>
        ) : courseLandingFormData?.image ? (
          <div className="relative">
            <Label>Uploaded Image</Label>
            <img
              src={courseLandingFormData.image}
              alt=""
              className="max-h-96 pt-3"
            />
            <X
              className="cursor-pointer absolute right-0 -top-10"
              onClick={() =>
                setCourseLandingFormData({
                  ...courseLandingFormData,
                  image: "",
                })
              }
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 ">
            <Label>Upload Course Image</Label>
            <Input type="file" onChange={handleImageUpload} accept="image/*" />
            <p>OR</p>
            Past URL here
            <Input
              type="text"
              value={courseLandingFormData.image}
              onChange={(e) =>
                setCourseLandingFormData({
                  ...courseLandingFormData,
                  image: e.target.value,
                })
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
