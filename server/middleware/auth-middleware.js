const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req?.headers.authorization;

  //   if (!authHeader) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: "User is not authenticated." });
  //   }
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "User is not authenticated." });
  }
  try {
    const decoded = jwt.verify(token, "JWT_SECRET");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expire token." });
  }
};
module.exports = authMiddleware;
