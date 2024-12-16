const mongoose = require("mongoose");

const LactureProgressSchema = new mongoose.Schema({
  lectureId: String,
  viewed: Boolean,
  dateViewed: Date,
});

const CourseProgressSchema = new mongoose.Schema({
  userId: String, // student id
  courseId: String,
  completed: Boolean,
  completionDate: Date,
  lecturesProgress: [LactureProgressSchema],
});

module.exports = mongoose.model("Progress", CourseProgressSchema);
