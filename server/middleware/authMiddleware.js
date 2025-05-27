import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  console.log("🔐 Incoming request cookies:", req.cookies);
  const token = req.cookies.token;
console.log("🔐 Cookies:", req.cookies, " | Raw headers:", req.headers.cookie);

  if (!token) {
    console.log("❌ No token found in cookies");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) throw new Error("User not found");
    req.user = user;
    console.log("✅ Authenticated user:", decoded);
    next();
  } catch (err) {
    console.log("❌ Invalid token", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
