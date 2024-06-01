import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("JWT Expired:", err);
          return res.status(401).json({ msg: "Token has expired" });
        } else if (err.name === "JsonWebTokenError") {
          console.error("Invalid JWT:", err);
          return res.status(401).json({ msg: "Invalid token" });
        } else {
          console.error("JWT Verification Error:", err);
          return res.status(403).json({ msg: "Token verification failed" });
        }
      }
      console.log("Decoded Token:", decoded);

      req.user = decoded.id;
      console.log("req.user.id:", req.user);

      next();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default authMiddleware;
