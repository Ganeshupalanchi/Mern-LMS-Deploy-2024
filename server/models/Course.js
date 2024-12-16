const mongoose = require("mongoose");

const lectureShchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  public_id: String,
  freePreview: Boolean,
});

const courseSchema = new mongoose.Schema({
  instructorId: String, // userId
  instructorName: String,
  date: Date,
  title: String,
  category: String,
  level: String,
  primaryLanguage: String,
  subtitle: String,
  description: String,
  objectives: String,
  pricing: Number,
  welcomeMessage: String,
  image: String,
  students: [
    {
      studentId: String,
      studentName: String,
      studentEmail: String,
      paidAmount: String,
    },
  ],
  curriculum: [lectureShchema],
  isPublished: Boolean,
});

module.exports = mongoose.model("Course", courseSchema);
