const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  // const existUser = await User.findOne({ $or: [{ email }, { username }] });
  const existUser = await User.findOne({ email });

  if (existUser) {
    return res
      .status(400)
      .json({ success: false, message: "This email is already exist." });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashPassword, role });
  await newUser.save();
  res.status(201).json({ success: true, message: "User registered." });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const accessToken = jwt.sign(
      {
        userId: checkUser._id,
        username: checkUser.username,
        email: checkUser.email,
        role: checkUser.role,
      },
      "JWT_SECRET",
      { expiresIn: "120m" }
    );
    res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        accessToken,
        user: {
          userId: checkUser._id,
          username: checkUser.username,
          email: checkUser.email,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {}
};

module.exports = { registerUser, loginUser };
