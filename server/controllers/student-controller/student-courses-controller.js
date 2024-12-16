const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  const { student_id } = req.params;

  try {
    const studentCourses = await StudentCourses.findOne({ userId: student_id });
    if (!studentCourses) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }
    return res
      .status(200)
      .json({ success: true, data: studentCourses.courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { getCoursesByStudentId };
