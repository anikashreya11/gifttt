const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: bearer token is required"
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret_change_me");
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };
    return next();
  } catch (_error) {
    return res.status(401).json({
      message: "Unauthorized: invalid or expired token"
    });
  }
}

module.exports = authMiddleware;
