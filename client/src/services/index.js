import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
};
export const loginService = async (formData) => {
  const { data } = await axiosInstance.post("/auth/login", {
    ...formData,
  });
  return data;
};
export const checkAuthService = async () => {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
};

export const mediaUploadService = async (formData, onProgressCallback) => {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
};
export const mediaDeleteService = async (public_id) => {
  const { data } = await axiosInstance.delete(`/media/delete/${public_id}`);
  return data;
};

export const fetchInstructorCourseListService = async () => {
  const { data } = await axiosInstance.get(`/instructor/course/get`);
  return data;
};
export const fetchInstructorCourseDetailsService = async (course_id) => {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/${course_id}`
  );
  return data;
};
export const addNewCourseService = async (formData) => {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
  return data;
};
export const updateCourseByIdService = async (course_id, formData) => {
  // return;

  const { data } = await axiosInstance.put(
    `/instructor/course/update/${course_id}`,
    formData
  );
  return data;
};

export const bulkMediaUploadService = async (formData, onProgressCallback) => {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
};

// Student View Services
export const fetchStudentViewCourseListService = async (query) => {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  return data;
};
export const fetchStudentViewCourseDetailsService = async (course_id) => {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${course_id}`
  );
  return data;
};

//create Student Order
export const createPaymentService = async (formData) => {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);
  return data;
};
export const captureAndFinalizePaymentService = async (formData) => {
  const { data } = await axiosInstance.post(
    `/student/order/capture_payment`,
    formData
  );
  return data;
};

// student bought courses services

export const fetchStudentBoughtCourses = async (student_id) => {
  const { data } = await axiosInstance.get(
    `/student/student-courses/get/${student_id}`
  );
  return data;
};

// Student Course Progress Services
export const getCurrentCourseProgressService = async (studentId, courseId) => {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${studentId}/${courseId}`
  );
  return data;
};
export const markLectureAsViewdService = async (
  userId,
  courseId,
  lectureId
) => {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewd`,
    { userId, courseId, lectureId }
  );
  return data;
};
export const resetCourseProgressService = async (userId, courseId) => {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    { userId, courseId }
  );
  return data;
};

//
