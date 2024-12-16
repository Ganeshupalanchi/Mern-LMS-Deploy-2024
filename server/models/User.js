const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String },
  email: String,
  password: String,
  role: {
    type: String,
    // enum: ["user", "moderator"], // Allowed roles
    // default: "user", // Default role
  },
});

module.exports = mongoose.model("User", UserSchema);
