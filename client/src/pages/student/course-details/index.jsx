import axiosInstance from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import {
  CheckCircle,
  CirclePause,
  Globe,
  Lock,
  PlayCircle,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import ReactPlayer from "react-player";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function StudentViewCourseDetailsPage() {
  const { studentBoughtCourseList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  // console.log(studentBoughtCourseList);

  const { auth } = useContext(AuthContext);
  const { course_id } = useParams();
  const navigate = useNavigate();
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const [openFreePreviewDialog, setOpenFreePreviewDialog] = useState(false);
  const [freePreviewUrlForDialog, setFreePreviewUrlForDialog] = useState(null);
  const [approveUrl, setApproveUrl] = useState(null);

  const freePreviewUrl = studentViewCourseDetails?.curriculum.find(
    (item) => item.freePreview === true
  ).videoUrl;
  //   const freePreviewLactures = studentViewCourseDetails?.curriculum.find(
  //     (item) => item.freePreview === true
  //   );
  //   const location = useLocation();
  //   //   console.log(freePreviewUrl);
  //   useEffect(() => {
  //     if (!location.pathname.includes("course/details")) {
  //       console.log("asda");

  //       setStudentViewCourseDetails(null);
  //     }
  //   }, [location.pathname]);
  const fetchCourseDetails = async () => {
    const response = await fetchStudentViewCourseDetailsService(course_id);
    if (response.success) {
      setStudentViewCourseDetails(response.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  };

  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth.user.userId,
      userName: auth.user.username,
      userEmail: auth.user.email,
      orderStatus: "pending",
      paymentStatus: "pending",
      paymentMethod: "paypal",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseId: studentViewCourseDetails?._id,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      coursePricing: studentViewCourseDetails?.pricing,
    };
    setLoadingState(true);
    const response = await createPaymentService(paymentPayload);
    if (response.success) {
      console.log(response.data);
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApproveUrl(response?.data?.approveUrl);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    const isStudentBoughtCourse = studentBoughtCourseList.find(
      (course) => course.courseId === studentViewCourseDetails?._id
    );
    if (isStudentBoughtCourse) {
      navigate(`/student/course-progress/${studentViewCourseDetails?._id}`);
    }
  }, [studentViewCourseDetails, studentBoughtCourseList]);

  useEffect(() => {
    if (approveUrl) {
      window.location.href = approveUrl;
    }
  }, [approveUrl]);
  useEffect(() => {
    if (course_id) {
      fetchCourseDetails();
    }
  }, [course_id]);
  if (loadingState) {
    return (
      <>
        <div className="flex items-center justify-center h-[100vh]">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      </>
    );
  }
  //   console.log(freePreviewUrlForDialog);

  return (
    <>
      <div className="container mx-auto p-4 ">
        <div className="bg-gray-900 text-white p-8 rounded-tl-lg">
          <h1 className="text-3xl font-bold mb-4">
            {studentViewCourseDetails?.title}
          </h1>
          <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
          <div className="flex md:items-center md:space-x-4 mt-2 text-sm flex-col md:flex-row">
            <span>
              Created By{" "}
              {studentViewCourseDetails?.instructorName.toUpperCase()}
            </span>
            <span>
              Created On {studentViewCourseDetails?.date.split("T")[0]}
            </span>
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              {studentViewCourseDetails?.primaryLanguage}
            </span>
            <span>
              {studentViewCourseDetails?.students.length}
              {studentViewCourseDetails?.students.length <= 1
                ? " Student"
                : " Students"}
            </span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <main className="flex-grow">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {studentViewCourseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <li className="flex items-start" key={index}>
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 " />
                        <span>{objective}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base mb-4">
                  {studentViewCourseDetails?.description}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
              </CardHeader>
              <CardContent>
                {studentViewCourseDetails?.curriculum.map(
                  (curriculumItem, index) => {
                    return (
                      <li
                        onClick={() => {
                          if (curriculumItem.freePreview) {
                            setOpenFreePreviewDialog(true);
                            setFreePreviewUrlForDialog(
                              curriculumItem?.videoUrl
                            );
                          }
                        }}
                        key={index}
                        className={`list-none flex items-center mb-4 ${
                          curriculumItem?.freePreview
                            ? "cursor-pointer"
                            : " cursor-not-allowed"
                        }`}
                      >
                        {curriculumItem?.freePreview ? (
                          <PlayCircle className="mr-2 h-4 w-4" />
                        ) : (
                          <Lock className="mr-2 h-4 w-4" />
                        )}
                        <span>{curriculumItem?.title}</span>
                      </li>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </main>
          <aside className="w-full lg:w-[500px] ">
            <Card className="sticky top-4 sm:min-w-[500px]">
              <CardContent className="p-6 ">
                <p className="mb-5 text-lg">See free preview of course here.</p>
                <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                  <ReactPlayer
                    url={freePreviewUrl}
                    width={"100%"}
                    height={"100%"}
                    controls={true}
                  />
                </div>
                <div className="mt-5">
                  <h2 className="font-bold text-2xl">
                    ${studentViewCourseDetails?.pricing}
                  </h2>
                  <Button className="w-full mt-3" onClick={handleCreatePayment}>
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
      <Dialog
        open={openFreePreviewDialog}
        onOpenChange={() => {
          setOpenFreePreviewDialog(false);
          setFreePreviewUrlForDialog(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="p-2">
            <VideoPlayer
              url={freePreviewUrlForDialog}
              width="450px"
              height="200px"
            />
          </div>
          <div>
            <p className="font-bold mb-3">
              You can select free preview videos from here.{" "}
            </p>
            {studentViewCourseDetails?.curriculum
              ?.filter((curriculumItem) => curriculumItem.freePreview)
              .map((lacture, i) => (
                <p
                  key={i}
                  className={`flex items-center mb-3 cursor-pointer`}
                  onClick={() => setFreePreviewUrlForDialog(lacture.videoUrl)}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  <span
                    className={`${
                      lacture.videoUrl === freePreviewUrlForDialog &&
                      "text-blue-500"
                    }`}
                  >
                    {lacture.title}
                  </span>
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
