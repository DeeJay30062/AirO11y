import mongoose from "mongoose";

const bookingGroupSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

const BookingGroup = mongoose.model("BookingGroup", bookingGroupSchema);
export default BookingGroup;