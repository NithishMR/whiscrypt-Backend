import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  console.log("auth middleware reached");
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch {
    console.log("couldnt decode");
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
