import { Router } from "express";
import {
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  submitFeedback,
  getBookingStats,
} from "../controllers/bookingController.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.js";
import {
  validateBooking,
  handleValidationErrors,
} from "../middlewares/validation.js";

const router = Router();

// Protected routes
router.post(
  "/",
  verifyJWT,
  validateBooking,
  handleValidationErrors,
  createBooking
);
router.get("/my-bookings", verifyJWT, getUserBookings);
router.get("/:id", verifyJWT, getBookingById);
router.put("/:id/status", verifyJWT, verifyAdmin, updateBookingStatus);
router.put("/:id/cancel", verifyJWT, cancelBooking);
router.post("/:id/feedback", verifyJWT, submitFeedback);

// Admin routes
router.get("/", verifyJWT, verifyAdmin, getAllBookings);
router.get("/stats/all", verifyJWT, verifyAdmin, getBookingStats);

export default router;
