const jwt = require("jsonwebtoken");

const getUserFromReq = (req) => {
  const token =
    req.cookies?.token ||
    req.headers?.authorization?.replace("Bearer ", "") ||
    req.headers?.token;

  if (!token) return null;

  try {
    const secretKey = process.env.JWT_KEY || "broadcast_cg_default_secret_key";
    return jwt.verify(token, secretKey);
  } catch {
    return null;
  }
};

const auth = (req, res, next) => {
  const user = getUserFromReq(req);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user;
  next();
};

module.exports = auth;
module.exports.getUserFromReq = getUserFromReq;
