const Course = require("../../models/Course");

const getAllCoursesInStudentView = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    let filter = {};
    let sort = {};
    if (category.length) {
      filter.category = { $in: category?.split(",") };
    }
    if (level.length) {
      filter.level = { $in: level?.split(",") };
    }
    if (primaryLanguage.length) {
      filter.primaryLanguage = { $in: primaryLanguage?.split(",") };
    }

    switch (sortBy) {
      case "price-lowtohigh":
        sort.pricing = 1;
        break;
      case "price-hightolow":
        sort.pricing = -1;
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        filter.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filter).sort(sort);

    res.status(200).json({ success: true, data: coursesList });
  } catch (error) {
    res.status(200).json({ success: false, message: "Internal Error" });
  }
};
const getCourseDetailsInStudentView = async (req, res) => {
  try {
    const { course_id } = req.params;
    const courseDetails = await Course.findById(course_id);
    // if (!courseDetails) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Course not found." });
    // }
    res.status(200).json({ success: true, data: courseDetails });
  } catch (error) {
    res.status(200).json({ success: false, message: "Internal Error" });
  }
};

module.exports = { getAllCoursesInStudentView, getCourseDetailsInStudentView };
