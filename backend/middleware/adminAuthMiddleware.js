const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.adminId || !decoded.role) {
      return res.status(401).json({
        message: "Invalid admin token",
      });
    }

    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};

module.exports = adminAuthMiddleware;
