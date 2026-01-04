import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
} from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/auth.js";
import {
  validateRegister,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validation.js";

const router = Router();

// Public routes
router.post("/register", validateRegister, handleValidationErrors, register);
router.post("/login", validateLogin, handleValidationErrors, login);

// Protected routes
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);
router.put("/profile", verifyJWT, updateProfile);

export default router;
