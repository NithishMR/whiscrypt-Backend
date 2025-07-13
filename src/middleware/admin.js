import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  console.log("admin middleware invoked");
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Token: ", token);
  console.log(req.headers);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Token missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    next(); // Only call next() once, if all checks pass
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default adminMiddleware;
