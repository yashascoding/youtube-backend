import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// Import routes
import authRoutes from "./routes/authRoutes.js"
import vehicleRoutes from "./routes/vehicleRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js"

// Import middleware
import { errorHandler, notFound } from "./middlewares/errorHandler.js"

//this is for frontend and backend communication
const app = express();
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN || "http://localhost:3000", //allowed path 
        credentials: true   //allow cookies jwt and sessions 
    }
))

app.use(express.json({ limit: "16kb" }))//this is to read json data sent from client to server but limited to 16 kb 
app.use(express.urlencoded({ extended: true }))//this is for parsing form data
app.use(cookieParser())//reads cookies from upcoming requests 
app.use(express.static("public"))//serve static files 

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/vehicles", vehicleRoutes)
app.use("/api/bookings", bookingRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "GoMoto API is running" })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

export { app }