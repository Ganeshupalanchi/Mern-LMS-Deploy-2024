import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  courseCategories,
  courseLevelOptions,
  filterOptions,
  languageOptions,
  sortOptions,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCourseListService } from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function StudentViewCoursesPage() {
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  // console.log(studentViewCoursesList);

  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState(
    JSON.parse(sessionStorage.getItem("filters")) || {}
  );
  const [searchParams, setSeachParams] = useSearchParams();
  const { auth } = useContext(AuthContext);
  const { studentBoughtCourseList } = useContext(StudentContext);

  const navigate = useNavigate();
  const handleFilterOnChange = (getSectionId, getCurrentOption) => {
    let cpyFilters = { ...filters };
    const isSectionExist = Object.keys(cpyFilters).indexOf(getSectionId);

    if (isSectionExist === -1) {
      cpyFilters = { ...cpyFilters, [getSectionId]: [getCurrentOption.value] };
    } else {
      const isExistCurrentOption = cpyFilters?.[getSectionId].indexOf(
        getCurrentOption.value
      );
      if (isExistCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption.value);
      } else {
        cpyFilters[getSectionId].splice(isExistCurrentOption, 1);
        if (cpyFilters[getSectionId].length === 0) {
          delete cpyFilters[getSectionId];
        }
      }
    }
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const createSearchParamsHelpers = (filterParams) => {
    let queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramsValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramsValue)}`);
      }
    }
    return queryParams.join("&");
  };
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const buildQueryStringForFilters = createSearchParamsHelpers(filters);

      setSeachParams(new URLSearchParams(buildQueryStringForFilters));
    } else {
      setSeachParams(new URLSearchParams({}));
    }
  }, [filters]);
  try {
  } catch (error) {}
  const fetchAllStudentViewCourses = async (filters, sort) => {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });

    const response = await fetchStudentViewCourseListService(query);

    if (response.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
  };

  useEffect(() => {
    if (filters !== null || sort !== null) {
      fetchAllStudentViewCourses(filters, sort);
    }
  }, [filters, sort]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 ">All Courses</h1>
      <div className="flex flex-col md:flex-row ">
        <aside className="w-full md:w-64 space-y-4">
          <div className="p-4 space-y-4 ">
            {Object.keys(filterOptions).map((keyItem, i) => (
              <div className=" space-y-4 " key={i}>
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2 ">
                  {filterOptions[keyItem].map((option, i) => (
                    <Label
                      className="flex font-medium items-center gap-3"
                      key={i}
                    >
                      <Checkbox
                        checked={Boolean(
                          filters[keyItem]?.includes(option.value) // Use a direct and reliable check
                        )}
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-base font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem, i) => (
                    <DropdownMenuRadioItem value={sortItem.value} key={i}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-gray-900 font-bold">
              {studentViewCoursesList?.length} results
            </span>
          </div>
          <div className="space-y-4">
            {loadingState ? (
              <>
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              </>
            ) : studentViewCoursesList && studentViewCoursesList?.length ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  key={courseItem?._id}
                  className="cursor-pointer"
                  onClick={() => {
                    const studentCourse =
                      studentBoughtCourseList.length &&
                      studentBoughtCourseList?.find(
                        (studentCourse) =>
                          studentCourse?.courseId === courseItem?._id
                      );

                    if (studentCourse) {
                      navigate(`/student/course-progress/${courseItem?._id}`);
                    } else {
                      navigate(`/student/course/details/${courseItem?._id}`);
                    }
                  }}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 ">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Create by{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mb-2 mt-3">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum.length <= 1
                            ? "Lacture"
                            : "Lactures"
                        } - ${
                          courseLevelOptions.find((option) => {
                            return option.value === courseItem?.level;
                          }).label
                        } Level`}
                      </p>
                      <p className="font-bold text-lg ">
                        $ {courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h1>No Courses Found.</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
