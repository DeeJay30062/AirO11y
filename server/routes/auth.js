// server/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Centralized token generator
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    }
  );
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullName,
      dateOfBirth,
      loyaltyId,
      status,
      homeAirport,
      tsaPrecheckNumber,
      phone,
      address,
    } = req.body;

    // Basic validation
    if (!fullName?.first || !fullName?.last || !dateOfBirth) {
      return res
        .status(400)
        .json({ error: "Missing required name or DOB fields" });
    }

    // Check for duplicate user
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const user = new User({
      username,
      email,
      passwordHash: password, // Password will be hashed via pre-save hook
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      loyaltyId,
      status,
      homeAirport,
      tsaPrecheckNumber,
      phone,
      address,
    });

    await user.save();

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15*60*1000,
      //secure: false,
    });

    res
      .status(201)
      .json({ message: "User created", user: { username, email } });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Registration failed", details: err.message });
      console.error("Registration Failed", err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15*60*1000,
      //secure: false,
    });

    res.json({
      message: "Login successful",
      token,
      user: { username },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// PROTECTED - GET CURRENT USER
router.get("/me", authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
