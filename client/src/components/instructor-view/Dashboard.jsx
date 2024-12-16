import { DollarSign, Users } from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function Dashboard({ listOfCourses }) {
  const calculateTotalStudentsAndProfit = () => {
    const listOfStudents = listOfCourses?.reduce((acc, course) => {
      const student = course.students?.map((item) => ({
        ...item,
        courseTitle: course.title,
      }));
      return acc.concat(student);
    }, []);
    const studentsLength = listOfStudents.length;
    const totalRevenue = listOfStudents.reduce(
      (acc, cur) => acc + Number(cur.paidAmount),
      0
    );
    return { studentsLength, totalRevenue, listOfStudents };
  };

  const { studentsLength, totalRevenue, listOfStudents } =
    calculateTotalStudentsAndProfit();
  // console.log(listOfStudents);

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: studentsLength,
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: totalRevenue,
    },
  ];
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {config.map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.label}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Students Lists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listOfStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="font-medium">
                      {student.courseTitle}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.studentName}
                    </TableCell>
                    <TableCell className="font-medium">
                      {student.studentEmail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
