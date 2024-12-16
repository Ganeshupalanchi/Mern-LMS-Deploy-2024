require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//auth routes
const authRoutes = require("./routes/auth-routes");

//upload asset to cloudinary
const mediaRouter = require("./routes/instructor-routes/media-routes");
const instructorCourseRouter = require("./routes/instructor-routes/course-routes.js");
// student router
const studentViewCourseRouter = require("./routes/student-routes/course-routes.js");
const studentViewOrderRoutes = require("./routes/student-routes/order-routes.js");
const studentCoursesRoutes = require("./routes/student-routes/student-courses.js");
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes.js");

const app = express();
const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET,POST,PUT, DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(express.json());
app.use(cors(corsOptions));
//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("mongoDB is connected."))
  .catch((e) => console.log(e));

// routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRouter);

// instructor routers
app.use("/instructor/course", instructorCourseRouter);

// student routers
app.use("/student/course", studentViewCourseRouter);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/student-courses", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong." });
});
app.listen(PORT, () => {
  console.log("Server is now running at port : " + PORT);
});
