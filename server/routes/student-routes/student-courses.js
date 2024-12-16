const express = require("express");
const {
  getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");
const router = express.Router();

router.get("/get/:student_id", getCoursesByStudentId);

module.exports = router;
