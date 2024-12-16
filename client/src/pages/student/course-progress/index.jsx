import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewdService,
  resetCourseProgressService,
} from "@/services";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function StudentCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLacture, setCurrentLacture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { course_id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const fetchCurrentCourseProgress = async () => {
    const response = await getCurrentCourseProgressService(
      auth?.user?.userId,
      course_id
    );

    if (response.success) {
      if (!response.data.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });
        if (response?.data?.completed) {
          setCurrentLacture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }
        if (!response?.data?.progress?.length) {
          setCurrentLacture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue =
            response?.data?.progress?.findLastIndex((obj) => obj.viewed);
          // console.log(lastIndexOfViewedAsTrue);

          setCurrentLacture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
          // console.log("Logging her");
        }
      }
    }
  };
  const handleRewatchCourse = async () => {
    const response = await resetCourseProgressService(
      auth?.user?.userId,
      studentCurrentCourseProgress?.courseDetails?._id
    );
    if (response.success) {
      setCurrentLacture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  };
  useEffect(() => {
    if (auth?.user?.userId) {
      fetchCurrentCourseProgress();
    }
  }, [course_id]);
  useEffect(() => {
    if (showConfetti) {
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }
  }, [showConfetti]);

  const updateCourseProgress = async () => {
    if (currentLacture && currentLacture?.progressValue === 1) {
      const response = await markLectureAsViewdService(
        auth?.user?.userId,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLacture?._id
      );
      if (response.success) {
        console.log(response);
        fetchCurrentCourseProgress();
      }
    }
  };
  useEffect(() => {
    if (currentLacture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLacture]);
  console.log(currentLacture);
  return (
    <>
      <div className="flex flex-col h-screen bg-[#1c1d1f] text-white ">
        {showConfetti && <Confetti />}
        <div className="flex items-center justify-between p-4 bg-inherit border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate("/student/student-courses")}
              className="text-black"
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2 " />
              Back to My Courses Page
            </Button>
            <h1 className="text-lg font-semibold hidden md:block">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
          <Button className="" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`flex-1 ${
              isSidebarOpen ? "mr-[400px]" : ""
            } transition-all duration-300`}
          >
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLacture?.videoUrl}
              onProgressUpdate={setCurrentLacture}
              progressData={currentLacture}
            />
            <div className="p-6 bg-[#1c1d1f]">
              <h2 className="font-bold text-2xl mb-2 text">
                {currentLacture?.title}
              </h2>
            </div>
          </div>
          <div
            className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
              isSidebarOpen ? "translate-x-0 " : "translate-x-full"
            }`}
          >
            <Tabs defaultValue="content" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 p-0 h-14 bg-[#1c1d1f]">
                <TabsTrigger
                  value="content"
                  className="text-black rounded-none h-full"
                >
                  Course Content
                </TabsTrigger>
                <TabsTrigger
                  value="overview"
                  className="text-black rounded-none h-full"
                >
                  Overview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                      (item, i) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                        >
                          {studentCurrentCourseProgress?.progress?.find(
                            (progressItem) =>
                              progressItem?.lectureId === item?._id
                          )?.viewed ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          {/* {i + 1}
                            {". "} */}
                          <span> {item?.title}</span>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="overview" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-4">
                      About this course
                    </h2>
                    <p className="text-gray-400">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Dialog open={lockCourse}>
          <DialogContent className="sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>You can't view this page.</DialogTitle>
              <DialogDescription>
                <p>Please purchase this course to get access.</p>
                <Link
                  to={"/student/courses"}
                  className="text-base text-blue-400"
                >
                  {" "}
                  Go to curses page.
                </Link>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={showCourseCompleteDialog}>
          <DialogContent showOverlay={false} className="sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>Congratulations!</DialogTitle>
              <div className="flex flex-col gap-3">
                <Label className="mb-3">You have completed the course.</Label>
                <div className="flex gap-3">
                  <Button onClick={() => navigate("/student/courses")}>
                    My Courses Page
                  </Button>
                  <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
