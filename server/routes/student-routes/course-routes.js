const express = require("express");
const {
  getAllCoursesInStudentView,
  getCourseDetailsInStudentView,
} = require("../../controllers/student-controller/course-controller");
const router = express.Router();

router.get("/get", getAllCoursesInStudentView);
router.get("/get/details/:course_id", getCourseDetailsInStudentView);

module.exports = router;
