import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: "Token is invalid or expired" });
      }

      req.user = decoded.id;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
