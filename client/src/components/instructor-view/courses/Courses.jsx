import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InstructorContext } from "@/context/instructor-context";
import { AuthContext } from "@/context/auth-context";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

export default function Courses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    currentEditedCourseId,
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  } = useContext(InstructorContext);

  return (
    <Card className="">
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-bold">All Courses</CardTitle>
        <Button
          className="p-6"
          onClick={() => {
            // setCurrentEditedCourseId(null);
            // setCourseCurriculumFormData(courseCurriculumInitialFormData);
            // setCourseLandingFormData(courseLandingInitialFormData);
            navigate("/instructor/create-new-course");
          }}
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length} </TableCell>
                      <TableCell>$ {course?.pricing}</TableCell>
                      <TableCell>
                        $ {course?.pricing * course?.students?.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          size="icon"
                        >
                          <Edit className="w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Delete className="w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : ""}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
