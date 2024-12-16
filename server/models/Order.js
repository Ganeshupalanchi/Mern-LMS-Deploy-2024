const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userEmail: String,
  orderStatus: String,
  paymentStatus: String,
  paymentMethod: String,
  orderDate: Date,
  paymentId: String,
  payerId: String,
  instructorId: String,
  instructorName: String,
  courseId: String,
  courseImage: String,
  courseTitle: String,
  coursePricing: String,
});

module.exports = mongoose.model("Order", OrderSchema);
