import MediaProgressbar from "@/components/common/MediaProgressbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { toast } from "@/hooks/use-toast";
import {
  bulkMediaUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Cross, Upload, X } from "lucide-react";
import React, { useContext, useRef, useState } from "react";

export default function CourseCurriculum() {
  const {
    courseCurrisulumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
    multipleMediaUploadProgress,
    setMultipleMediaUploadProgress,
  } = useContext(InstructorContext);
  const bulkUploadInputRef = useRef(null);
  const [lactureDeleteLoading, setLactureDeleteLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(null);
  const handleNewLacture = () => {
    setCourseCurriculumFormData([
      ...courseCurrisulumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  };

  const handleCourseTitleChange = (e, currentIndex) => {
    let cpyCourseCurrisulumFormData = [...courseCurrisulumFormData];
    // cpyCourseCurrisulumFormData[currentIndex].title = e.target.value;
    cpyCourseCurrisulumFormData[currentIndex] = {
      ...cpyCourseCurrisulumFormData[currentIndex],
      title: e.target.value,
    };
    setCourseCurriculumFormData(cpyCourseCurrisulumFormData);
  };
  const handleFreePreviewChange = (value, currentIndex) => {
    for (const item of courseCurrisulumFormData) {
      item.freePreview = false;
    }
    let cpyCourseCurrisulumFormData = [...courseCurrisulumFormData];
    cpyCourseCurrisulumFormData[currentIndex] = {
      ...cpyCourseCurrisulumFormData[currentIndex],
      freePreview: value,
    };

    setCourseCurriculumFormData(cpyCourseCurrisulumFormData);
  };

  const handleSingleLactureUpload = async (e, currentIndex) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setCurrentIndex([currentIndex]);
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseCurriculumFormData((prevData) => {
            const updatedData = [...prevData];
            updatedData[currentIndex] = {
              ...updatedData[currentIndex],
              videoUrl: response?.data?.url,
              public_id: response?.data?.public_id,
            };
            return updatedData;
          });
          setMediaUploadProgress(false);
          setCurrentIndex(null);
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Failed to upload video.",
        });
        setMediaUploadProgress(false);
        setCurrentIndex(null);
      }
    }
  };
  const isCourseCurriculumFormDataValid = () => {
    return courseCurrisulumFormData?.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item?.title?.trim() !== "" &&
        item?.videoUrl?.trim() !== ""
      );
    });
  };

  const handleReplaceVideo = async (currentIndex) => {
    let cpyCourseCurrisulumFormData = [...courseCurrisulumFormData];
    const getCurrentVideoPublicId =
      courseCurrisulumFormData[currentIndex].public_id;
    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );
    if (deleteCurrentMediaResponse.success) {
      cpyCourseCurrisulumFormData[currentIndex] = {
        ...cpyCourseCurrisulumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
        freePreview: false,
      };
      setCourseCurriculumFormData(cpyCourseCurrisulumFormData);
    }
  };

  // console.log(courseCurrisulumFormData);
  const handleOpenBulkUpload = () => {
    bulkUploadInputRef.current?.click();
  };

  const areAllCourseCurriculumFormDataObjectEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  };

  const handleMediaBulkUpload = async (e) => {
    const selectedFiles = Array.from(e.target?.files);
    const bulkFormData = new FormData();
    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMultipleMediaUploadProgress(true);
      const response = await bulkMediaUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response.success) {
        console.log(response.data);
        setMultipleMediaUploadProgress(false);
        let cpyCourseCurriculumFormData =
          areAllCourseCurriculumFormDataObjectEmpty(courseCurrisulumFormData)
            ? []
            : [...courseCurrisulumFormData];
        console.log(cpyCourseCurriculumFormData);

        // let cpyCourseCurriculumFormData = [...courseCurrisulumFormData];
        const result = response.data.map((item, i) => ({
          title: `Lecture ${cpyCourseCurriculumFormData?.length + (i + 1)} `,
          videoUrl: item.url,
          freePreview: false,
          public_id: item.public_id,
        }));

        setCourseCurriculumFormData([
          ...cpyCourseCurriculumFormData,
          ...result,
        ]);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
    // const response =
  };

  const handleDeleteLacture = async (index) => {
    setLactureDeleteLoading(true);
    const deleteLacturePublicId = courseCurrisulumFormData[index].public_id;
    // console.log(deleteLacturePublicId);
    const response = await mediaDeleteService(deleteLacturePublicId);
    if (response.success) {
      // console.log(response.data);
      setLactureDeleteLoading(false);
      setCourseCurriculumFormData((prevData) =>
        prevData.filter((_, i) => i !== index)
      );
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleNewLacture}
          disabled={
            !isCourseCurriculumFormDataValid() || mediaUploadProgress
            // courseCurrisulumFormData.length > 1
          }
        >
          Add Lecture
        </Button>

        {multipleMediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={multipleMediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}
        <div className="mt-4 space-y-4">
          {courseCurrisulumFormData.map((curriculumItem, index) => (
            <div className="border p-5 rounded-md" key={index}>
              <div className="flex gap-5 lg:items-center lg:flex-row items-start flex-col relative">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title ${index + 1}`}
                  placeholder="Enter lacture title"
                  className="max-w-96"
                  value={courseCurrisulumFormData[index].title}
                  onChange={(e) => handleCourseTitleChange(e, index)}
                />
                <div className="flex items-center space-x-2 ">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    disabled={!courseCurrisulumFormData[index].videoUrl}
                    checked={courseCurrisulumFormData[index].freePreview}
                    id={`freePreview ${index + 1}`}
                  />
                  <Label
                    htmlFor={`freePreview ${index + 1}`}
                    className="cursor-pointer"
                  >
                    Free Preview
                  </Label>
                </div>
                {courseCurrisulumFormData.length > 1 && (
                  <div
                    className="absolute right-0 cursor-pointer"
                    onClick={() =>
                      setCourseCurriculumFormData((prevData) => {
                        return prevData.filter((prevData, i) => i !== index);
                      })
                    }
                  >
                    {/* <Button size="icon"> */}
                    <X size={24} />
                    {/* </Button> */}
                  </div>
                )}
              </div>
              <div className="mt-6">
                {mediaUploadProgress && currentIndex?.includes(index) ? (
                  <MediaProgressbar
                    isMediaUploading={mediaUploadProgress}
                    progress={mediaUploadProgressPercentage}
                  />
                ) : (
                  ""
                )}
                {courseCurrisulumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3 flex-col lg:flex-row items-start">
                    <VideoPlayer
                      width="450px"
                      height="200px"
                      url={courseCurrisulumFormData[index]?.videoUrl}
                    />
                    <div className="flex gap-3">
                      <Button
                        className=""
                        onClick={() => handleReplaceVideo(index)}
                      >
                        Replace Video
                      </Button>
                      <Button
                        className="bg-red-900"
                        onClick={() => handleDeleteLacture(index)}
                      >
                        {lactureDeleteLoading
                          ? "Deleting..."
                          : "Delete Lecture"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept={"video/*"}
                    className=""
                    disabled={mediaUploadProgress}
                    onChange={(e) => handleSingleLactureUpload(e, index)}
                    // className="max-w-96"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
