const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.replace("Bearer ", "") ||
    req.headers?.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const secretKey = process.env.JWT_KEY || "broadcast_cg_default_secret_key";
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = auth;
