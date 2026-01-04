import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["bike", "car", "truck", "jcb"],
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      default: "diesel",
    },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    insurance: {
      type: String,
      enum: ["basic", "standard", "premium"],
      default: "basic",
    },
    insurancePrice: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "inactive"],
      default: "active",
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: Date,
      },
    ],
    documents: {
      registrationCertificate: String,
      insuranceCertificate: String,
      pollutionCertificate: String,
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
