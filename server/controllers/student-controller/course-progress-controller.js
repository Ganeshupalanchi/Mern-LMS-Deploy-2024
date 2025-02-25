const Course = require("../../models/Course");
const CourseProgress = require("../../models/CourseProgress");
const StudentCourses = require("../../models/StudentCourses");

// mark current lacture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          {
            lectureId,
            viewed: true, // true means 1
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lecturesProgress.find(
        (item) => item.lectureId === lectureId
      );
      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lecturesProgress.push({
          lectureId,
          viewed: true, // true means 1
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    // check all the lectures are viewd or not
    const allLecturesViewd =
      progress.lecturesProgress.length === course.curriculum.length &&
      progress.lecturesProgress.every((item) => item.viewed);
    if (allLecturesViewd) {
      progress.completed = true;
      progress.completionDate = new Date();
      await progress.save();
    }
    res.status(200).json({
      success: true,
      message: "Lecture Marked as viewd.",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some Error Occured." });
  }
};

// get current course progress
const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const isStudentBoughtCourse = await StudentCourses.findOne({
      userId,
      "courses.courseId": courseId,
    });

    if (!isStudentBoughtCourse) {
      return res.status(200).json({
        success: true,
        data: { isPurchased: false },
        message: "You need to purchase this course to access it.",
      });
    }
    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress.lecturesProgress.length === 0
    ) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course.",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }
    const courseDetails = await Course.findById(courseId);
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lecturesProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some Error Occured." });
  }
};

// reset course progress

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      return res
        .status(404)
        .json({ success: false, message: "Progress not found." });
    }
    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completionDate = null;
    await progress.save();
    res.status(200).json({
      success: true,
      message: "Course Progress has been reset.",
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some Error Occured." });
  }
};

module.exports = {
  markCurrentLectureAsViewed,
  getCurrentCourseProgress,
  resetCurrentCourseProgress,
};
