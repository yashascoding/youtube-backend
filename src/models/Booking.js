import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    dropoffDate: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      address: String,
      city: String,
      zipCode: String,
    },
    dropoffLocation: {
      address: String,
      city: String,
      zipCode: String,
    },
    rentalDays: {
      type: Number,
      required: true,
    },
    rentalHours: {
      type: Number,
      default: 0,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    insuranceType: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },
    insurancePrice: {
      type: Number,
      default: 0,
    },
    additionalCharges: [
      {
        description: String,
        amount: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "upi", "wallet"],
    },
    advancePayment: {
      type: Number,
      default: 0,
    },
    remarks: {
      type: String,
    },
    damageReport: {
      reported: Boolean,
      description: String,
      estimatedCost: Number,
      images: [String],
    },
    cancellationReason: {
      type: String,
    },
    cancellationDate: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    feedback: {
      rating: {
        type: Number,
        min: 0,
        max: 5,
      },
      comment: String,
      submittedAt: Date,
    },
  },
  { timestamps: true }
);

// Generate booking ID before saving
bookingSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Booking").countDocuments();
    this.bookingId = `GOMOTO${Date.now()}${count + 1}`;
  }
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
