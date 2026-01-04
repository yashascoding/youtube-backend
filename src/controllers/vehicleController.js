import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Vehicle } from "../models/Vehicle.js";

export const createVehicle = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    registrationNumber,
    manufacturer,
    model,
    year,
    color,
    fuelType,
    transmission,
    seatingCapacity,
    pricePerDay,
    pricePerHour,
    description,
    features,
    insurance,
    insurancePrice,
    location,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !type ||
    !registrationNumber ||
    !manufacturer ||
    !model ||
    !year ||
    !seatingCapacity ||
    !pricePerDay ||
    !pricePerHour
  ) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Check if vehicle already exists
  const existingVehicle = await Vehicle.findOne({ registrationNumber });
  if (existingVehicle) {
    throw new ApiError(
      409,
      "Vehicle with this registration number already exists"
    );
  }

  // Create vehicle
  const vehicle = await Vehicle.create({
    name,
    type,
    registrationNumber: registrationNumber.toUpperCase(),
    manufacturer,
    model,
    year,
    color,
    fuelType,
    transmission,
    seatingCapacity,
    pricePerDay,
    pricePerHour,
    description,
    features,
    insurance,
    insurancePrice,
    location,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, vehicle, "Vehicle created successfully"));
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const { type, isAvailable, status, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (isAvailable !== undefined) {
    filter.isAvailable = isAvailable === "true";
  }

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const vehicles = await Vehicle.find(filter)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Vehicle.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        vehicles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      "Vehicles fetched successfully"
    )
  );
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, "Vehicle fetched successfully"));
});

export const getVehiclesByType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!["bike", "car", "truck", "jcb"].includes(type)) {
    throw new ApiError(400, "Invalid vehicle type");
  }

  const skip = (page - 1) * limit;

  const vehicles = await Vehicle.find({ type, isAvailable: true })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Vehicle.countDocuments({ type, isAvailable: true });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        vehicles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      `${type}s fetched successfully`
    )
  );
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Remove fields that shouldn't be updated
  delete updateData.registrationNumber;
  delete updateData.totalBookings;

  const vehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, vehicle, "Vehicle updated successfully"));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vehicle = await Vehicle.findByIdAndDelete(id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Vehicle deleted successfully"));
});

export const updateVehicleAvailability = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isAvailable } = req.body;

  if (typeof isAvailable !== "boolean") {
    throw new ApiError(400, "isAvailable must be a boolean");
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    id,
    { isAvailable },
    { new: true }
  );

  if (!vehicle) {
    throw new ApiError(404, "Vehicle not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        vehicle,
        `Vehicle marked as ${isAvailable ? "available" : "unavailable"}`
      )
    );
});

export const getAvailableVehicles = asyncHandler(async (req, res) => {
  const { type, pickupDate, dropoffDate, page = 1, limit = 10 } = req.query;

  const filter = { isAvailable: true, status: "active" };

  if (type) {
    filter.type = type;
  }

  const skip = (page - 1) * limit;

  const vehicles = await Vehicle.find(filter)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Vehicle.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        vehicles,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      "Available vehicles fetched successfully"
    )
  );
});
