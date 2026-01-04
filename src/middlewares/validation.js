import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    throw new ApiError(400, "Validation failed", formattedErrors);
  }
  next();
};

// Auth validations
export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("phone")
    .isMobilePhone("en-IN")
    .withMessage("Please provide a valid phone number"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Vehicle validations
export const validateVehicle = [
  body("name").trim().notEmpty().withMessage("Vehicle name is required"),
  body("type")
    .isIn(["bike", "car", "truck", "jcb"])
    .withMessage("Vehicle type must be bike, car, truck, or jcb"),
  body("registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required"),
  body("manufacturer")
    .trim()
    .notEmpty()
    .withMessage("Manufacturer is required"),
  body("model").trim().notEmpty().withMessage("Model is required"),
  body("year")
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Year must be valid"),
  body("seatingCapacity")
    .isInt({ min: 1 })
    .withMessage("Seating capacity must be at least 1"),
  body("pricePerDay")
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a valid number"),
  body("pricePerHour")
    .isFloat({ min: 0 })
    .withMessage("Price per hour must be a valid number"),
];

// Booking validations
export const validateBooking = [
  body("vehicleId").isMongoId().withMessage("Valid vehicle ID is required"),
  body("pickupDate")
    .isISO8601()
    .withMessage("Valid pickup date is required"),
  body("dropoffDate")
    .isISO8601()
    .withMessage("Valid dropoff date is required"),
  body("rentalDays")
    .isInt({ min: 1 })
    .withMessage("Rental days must be at least 1"),
];
