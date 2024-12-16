const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully.",
        data: saveCourse,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: false, message: "SOme Error Accoured." });
  }
};
const getAllCourses = async (req, res) => {
  try {
    const courseList = await Course.find({});
    res.status(200).json({ success: true, data: courseList });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: false, message: "SOme Error Accoured." });
  }
};
const getCourseDetails = async (req, res) => {
  try {
    const { course_id } = req.params;
    const courseDetails = await Course.findById(course_id);
    if (!courseDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Course's details not found." });
    }
    res.status(200).json({ success: true, data: courseDetails });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: false, message: "SOme Error Accoured." });
  }
};
const updateCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;
    const updatedCourseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      course_id,
      updatedCourseData,
      { new: true }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ success: false, message: "Course's details not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Course updated.", data: updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(501).json({ success: false, message: "SOme Error Accoured." });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  getCourseDetails,
  updateCourseById,
};
