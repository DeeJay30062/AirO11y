/* User.js*/

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    fullName: {
      first: { type: String, required: true },
      middle: { type: String },
      last: { type: String, required: true },
      suffix: { type: String },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    dateOfBirth: { type: Date, required: true },

    // Optional fields
    loyaltyId: { type: String },
    status: {
      type: String,
      enum: ["Standard", "Silver", "Gold", "Platinum"],
      default: "Standard",
    },
    homeAirport: { type: String },
    tsaPrecheckNumber: { type: String },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next(); // Skip if password unchanged

  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords (used during login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model("User", userSchema);
export default User;
