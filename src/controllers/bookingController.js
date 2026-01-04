import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/Booking.js";
import { Vehicle } from "../models/Vehicle.js";
import { User } from "../models/User.js";

export const createBooking = asyncHandler(async (req, res) => {
  const {
    vehicleId,
    pickupDate,
    dropoffDate,
    pickupLocation,
    dropoffLocation,
    rentalDays,
    rentalHours,
    insuranceType,
    additionalCharges,
    paymentMethod,
  } = req.body;

  // Validate required fields
  if (!vehicleId || !pickupDate || !dropoffDate || !rentalDays) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  // Check if vehicle is available
  if (!vehicle.isAvailable) {
    throw new ApiError(400, "Vehicle is not available for booking");
  }

  // Parse dates
  const pickup = new Date(pickupDate);
  const dropoff = new Date(dropoffDate);

  if (pickup >= dropoff) {
    throw new ApiError(400, "Dropoff date must be after pickup date");
  }

  // Calculate pricing
  let totalAmount = 0;
  let insurancePrice = 0;

  // Daily charges
  totalAmount += vehicle.pricePerDay * rentalDays;

  // Hourly charges (if any)
  if (rentalHours && rentalHours > 0) {
    totalAmount += vehicle.pricePerHour * rentalHours;
  }

  // Insurance charges
  if (insuranceType) {
    const insuranceRates = {
      basic: vehicle.pricePerDay * 0.05,
      standard: vehicle.pricePerDay * 0.1,
      premium: vehicle.pricePerDay * 0.15,
    };
    insurancePrice = insuranceRates[insuranceType] * rentalDays || 0;
    totalAmount += insurancePrice;
  }

  // Additional charges
  if (additionalCharges && Array.isArray(additionalCharges)) {
    const additionalTotal = additionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    );
    totalAmount += additionalTotal;
  }

  // Create booking
  const booking = await Booking.create({
    userId: req.user._id,
    vehicleId,
    pickupDate: pickup,
    dropoffDate: dropoff,
    pickupLocation,
    dropoffLocation,
    rentalDays,
    rentalHours: rentalHours || 0,
    dailyRate: vehicle.pricePerDay,
    hourlyRate: vehicle.pricePerHour,
    insuranceType,
    insurancePrice,
    additionalCharges: additionalCharges || [],
    totalAmount,
    paymentMethod,
    advancePayment: Math.ceil(totalAmount * 0.2), // 20% advance
    bookingStatus: "pending",
    paymentStatus: "pending",
  });

  // Populate vehicle and user details
  await booking.populate("vehicleId userId");

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Booking created successfully"));
});

export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate("vehicleId")
    .populate("userId", "-password");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking fetched successfully"));
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = { userId: req.user._id };

  if (status) {
    filter.bookingStatus = status;
  }

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(filter)
    .populate("vehicleId")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      "User bookings fetched successfully"
    )
  );
});

export const getAllBookings = asyncHandler(async (req, res) => {
  const { status, vehicleId, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (status) {
    filter.bookingStatus = status;
  }

  if (vehicleId) {
    filter.vehicleId = vehicleId;
  }

  const skip = (page - 1) * limit;

  const bookings = await Booking.find(filter)
    .populate("vehicleId")
    .populate("userId", "-password")
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const total = await Booking.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bookings,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      "All bookings fetched successfully"
    )
  );
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { bookingStatus, paymentStatus } = req.body;

  const validBookingStatuses = [
    "pending",
    "confirmed",
    "active",
    "completed",
    "cancelled",
  ];
  const validPaymentStatuses = ["pending", "completed", "cancelled"];

  if (bookingStatus && !validBookingStatuses.includes(bookingStatus)) {
    throw new ApiError(400, "Invalid booking status");
  }

  if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    {
      ...(bookingStatus && { bookingStatus }),
      ...(paymentStatus && { paymentStatus }),
    },
    { new: true }
  ).populate("vehicleId");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking updated successfully"));
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (["completed", "cancelled"].includes(booking.bookingStatus)) {
    throw new ApiError(400, "Cannot cancel a completed or already cancelled booking");
  }

  // Calculate refund (80% of total if booking is more than 48 hours away)
  const now = new Date();
  const hoursUntilPickup = (booking.pickupDate - now) / (1000 * 60 * 60);

  let refundAmount = 0;
  if (hoursUntilPickup > 48) {
    refundAmount = Math.ceil(booking.totalAmount * 0.8);
  } else if (hoursUntilPickup > 24) {
    refundAmount = Math.ceil(booking.totalAmount * 0.5);
  }

  booking.bookingStatus = "cancelled";
  booking.paymentStatus = "cancelled";
  booking.cancellationReason = cancellationReason;
  booking.cancellationDate = new Date();
  booking.refundAmount = refundAmount;

  await booking.save();
  await booking.populate("vehicleId");

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

export const submitFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 0 || rating > 5) {
    throw new ApiError(400, "Rating must be between 0 and 5");
  }

  const booking = await Booking.findByIdAndUpdate(
    id,
    {
      feedback: {
        rating,
        comment,
        submittedAt: new Date(),
      },
    },
    { new: true }
  ).populate("vehicleId");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Update vehicle rating
  const bookingsForVehicle = await Booking.find({
    vehicleId: booking.vehicleId._id,
    "feedback.rating": { $exists: true },
  });

  if (bookingsForVehicle.length > 0) {
    const avgRating =
      bookingsForVehicle.reduce((sum, b) => sum + b.feedback.rating, 0) /
      bookingsForVehicle.length;

    await Vehicle.findByIdAndUpdate(booking.vehicleId._id, {
      rating: Math.round(avgRating * 10) / 10,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Feedback submitted successfully"));
});

export const getBookingStats = asyncHandler(async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({
    bookingStatus: "confirmed",
  });
  const completedBookings = await Booking.countDocuments({
    bookingStatus: "completed",
  });
  const cancelledBookings = await Booking.countDocuments({
    bookingStatus: "cancelled",
  });
  const totalRevenue = await Booking.aggregate([
    {
      $match: { paymentStatus: "completed" },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      "Booking statistics fetched successfully"
    )
  );
});
