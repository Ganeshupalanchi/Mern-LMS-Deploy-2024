const express = require("express");
const {
  addNewCourse,
  getAllCourses,
  getCourseDetails,
  updateCourseById,
} = require("../../controllers/instructor-controller/course-controller");
const router = express.Router();

// router.post("/", addNewCourse);
router.post("/add", addNewCourse);
router.put("/update/:course_id", updateCourseById);
router.get("/get", getAllCourses);
router.get("/get/:course_id", getCourseDetails);

module.exports = router;
