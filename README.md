# GoMoto - Vehicle Rental Backend API

A comprehensive REST API backend for a vehicle rental platform supporting multiple vehicle types including bikes, cars, trucks, and JCBs. Built with Node.js, Express, MongoDB, and includes complete authentication, vehicle management, and booking system.

## Features

- **User Management**: Registration, login, profile management with JWT authentication
- **Vehicle Management**: CRUD operations for multiple vehicle types (bike, car, truck, JCB)
- **Booking System**: Complete booking lifecycle with status management
- **Payment Tracking**: Advance payment, insurance, and additional charges
- **Cancellation Policy**: Dynamic refund calculation based on cancellation time
- **Feedback System**: User ratings and reviews for vehicles
- **Admin Dashboard**: Vehicle and booking statistics
- **Role-based Access Control**: User and Admin roles

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Development**: nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Postman (for API testing)
- Git

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend_hitesh_choudhary
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.sample` to `.env`:
```bash
cp .env.sample .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=gomoto

# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

# JWT Secret Keys
ACCESS_TOKEN_SECRET=your_secure_access_token_secret_key_32_chars_min
REFRESH_TOKEN_SECRET=your_secure_refresh_token_secret_key_32_chars_min
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
```

### 4. MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user with username and password
4. Whitelist your IP
5. Get connection string and add to `.env` as `MONGO_URI`

Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### 5. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Server will start on `http://localhost:8000`

## API Endpoints

### Base URL
```
http://localhost:8000/api
```

---

## 1. Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phone": "+919876543210"
}
```

Response (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "+919876543210",
    "isActive": true,
    "role": "user"
  },
  "message": "User registered successfully",
  "success": true
}
```

### Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

### Get Current User
**GET** `/auth/me`

Headers:
```
Authorization: Bearer <accessToken>
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "message": "User fetched successfully",
  "success": true
}
```

### Update Profile
**PUT** `/auth/profile`

Headers:
```
Authorization: Bearer <accessToken>
```

Request Body:
```json
{
  "fullName": "John Doe Updated",
  "phone": "+919876543210",
  "licenseNumber": "DL01AB1234567",
  "licenseExpiry": "2025-12-31",
  "address": {
    "street": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India"
  }
}
```

### Logout
**POST** `/auth/logout`

Headers:
```
Authorization: Bearer <accessToken>
```

---

## 2. Vehicle Endpoints

### Create Vehicle (Admin Only)
**POST** `/vehicles/`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

Request Body:
```json
{
  "name": "Honda CB 150",
  "type": "bike",
  "registrationNumber": "DL01AB1234",
  "manufacturer": "Honda",
  "model": "CB 150",
  "year": 2023,
  "color": "Red",
  "fuelType": "petrol",
  "transmission": "manual",
  "seatingCapacity": 2,
  "pricePerDay": 500,
  "pricePerHour": 100,
  "description": "Reliable bike for city travel",
  "features": ["ABS", "Digital Dashboard", "Alloy Wheels"],
  "insurance": "basic",
  "insurancePrice": 50,
  "location": {
    "address": "123 Main Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  }
}
```

Response (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Honda CB 150",
    "type": "bike",
    "registrationNumber": "DL01AB1234",
    "pricePerDay": 500,
    "pricePerHour": 100,
    "isAvailable": true,
    "rating": 0,
    "totalBookings": 0
  },
  "message": "Vehicle created successfully",
  "success": true
}
```

### Get All Vehicles
**GET** `/vehicles/all`

Query Parameters:
- `type`: bike, car, truck, jcb (optional)
- `isAvailable`: true/false (optional)
- `status`: active, maintenance, inactive (optional)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

Example:
```
GET /vehicles/all?type=car&isAvailable=true&page=1&limit=10
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "vehicles": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Honda CB 150",
        "type": "bike",
        "pricePerDay": 500,
        "rating": 4.5,
        "isAvailable": true
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "message": "Vehicles fetched successfully",
  "success": true
}
```

### Get Vehicle by ID
**GET** `/vehicles/:id`

Example:
```
GET /vehicles/507f1f77bcf86cd799439012
```

### Get Vehicles by Type
**GET** `/vehicles/type/:type`

Types: `bike`, `car`, `truck`, `jcb`

Query Parameters:
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

Example:
```
GET /vehicles/type/car?page=1&limit=10
```

### Get Available Vehicles
**GET** `/vehicles/available`

Query Parameters:
- `type`: vehicle type (optional)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

### Update Vehicle (Admin Only)
**PUT** `/vehicles/:id`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

Request Body:
```json
{
  "pricePerDay": 600,
  "description": "Updated description",
  "status": "maintenance"
}
```

### Delete Vehicle (Admin Only)
**DELETE** `/vehicles/:id`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

### Update Vehicle Availability (Admin Only)
**PATCH** `/vehicles/:id/availability`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

Request Body:
```json
{
  "isAvailable": false
}
```

---

## 3. Booking Endpoints

### Create Booking
**POST** `/bookings/`

Headers:
```
Authorization: Bearer <accessToken>
```

Request Body:
```json
{
  "vehicleId": "507f1f77bcf86cd799439012",
  "pickupDate": "2025-02-15T10:00:00Z",
  "dropoffDate": "2025-02-17T10:00:00Z",
  "rentalDays": 2,
  "rentalHours": 0,
  "pickupLocation": {
    "address": "Airport",
    "city": "Delhi",
    "zipCode": "110001"
  },
  "dropoffLocation": {
    "address": "Hotel",
    "city": "Delhi",
    "zipCode": "110001"
  },
  "insuranceType": "standard",
  "paymentMethod": "credit_card",
  "additionalCharges": [
    {
      "description": "GPS Device",
      "amount": 100
    }
  ]
}
```

Response (201):
```json
{
  "statusCode": 201,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "bookingId": "GOMOTO1705312000001",
    "userId": "507f1f77bcf86cd799439011",
    "vehicleId": "507f1f77bcf86cd799439012",
    "rentalDays": 2,
    "totalAmount": 1200,
    "bookingStatus": "pending",
    "paymentStatus": "pending",
    "advancePayment": 240
  },
  "message": "Booking created successfully",
  "success": true
}
```

### Get My Bookings
**GET** `/bookings/my-bookings`

Headers:
```
Authorization: Bearer <accessToken>
```

Query Parameters:
- `status`: pending, confirmed, active, completed, cancelled (optional)
- `page`: page number (default: 1)
- `limit`: items per page (default: 10)

### Get Booking by ID
**GET** `/bookings/:id`

Headers:
```
Authorization: Bearer <accessToken>
```

### Update Booking Status (Admin Only)
**PUT** `/bookings/:id/status`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

Request Body:
```json
{
  "bookingStatus": "confirmed",
  "paymentStatus": "completed"
}
```

Valid statuses:
- `bookingStatus`: pending, confirmed, active, completed, cancelled
- `paymentStatus`: pending, completed, cancelled

### Cancel Booking
**PUT** `/bookings/:id/cancel`

Headers:
```
Authorization: Bearer <accessToken>
```

Request Body:
```json
{
  "cancellationReason": "Emergency trip postponed"
}
```

Refund Policy:
- More than 48 hours before pickup: 80% refund
- 24-48 hours before pickup: 50% refund
- Less than 24 hours: No refund

### Submit Feedback
**POST** `/bookings/:id/feedback`

Headers:
```
Authorization: Bearer <accessToken>
```

Request Body:
```json
{
  "rating": 4.5,
  "comment": "Great vehicle and excellent service!"
}
```

### Get Booking Statistics (Admin Only)
**GET** `/bookings/stats/all`

Headers:
```
Authorization: Bearer <adminAccessToken>
```

Response (200):
```json
{
  "statusCode": 200,
  "data": {
    "totalBookings": 150,
    "confirmedBookings": 100,
    "completedBookings": 80,
    "cancelledBookings": 5,
    "totalRevenue": 250000
  },
  "message": "Booking statistics fetched successfully",
  "success": true
}
```

---

## Testing in Postman

### 1. Import Collection

1. Open Postman
2. Create a new collection named "GoMoto"
3. Create the following requests

### 2. Setup Environment Variables

In Postman, create an environment with:

```
baseUrl = http://localhost:8000/api
accessToken = (copy token from login response)
adminToken = (admin access token)
vehicleId = (from vehicle creation)
bookingId = (from booking creation)
userId = (from user data)
```

### 3. Sample Testing Flow

**Step 1: Register User**
```
POST {{baseUrl}}/auth/register
Body (raw JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123456",
  "fullName": "Test User",
  "phone": "+919876543210"
}
```

**Step 2: Login**
```
POST {{baseUrl}}/auth/login
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "Test@123456"
}
```
Copy the `accessToken` from response to environment variable.

**Step 3: Create Vehicle (Admin)**
```
POST {{baseUrl}}/vehicles/
Headers:
  Authorization: Bearer {{adminToken}}

Body (raw JSON):
{
  "name": "Toyota Innova",
  "type": "car",
  "registrationNumber": "DL01AB9999",
  "manufacturer": "Toyota",
  "model": "Innova",
  "year": 2023,
  "color": "Silver",
  "seatingCapacity": 8,
  "pricePerDay": 2500,
  "pricePerHour": 500,
  "fuelType": "diesel"
}
```

**Step 4: Get All Vehicles**
```
GET {{baseUrl}}/vehicles/all
```

**Step 5: Create Booking**
```
POST {{baseUrl}}/bookings/
Headers:
  Authorization: Bearer {{accessToken}}

Body (raw JSON):
{
  "vehicleId": "{{vehicleId}}",
  "pickupDate": "2025-02-20T10:00:00Z",
  "dropoffDate": "2025-02-22T10:00:00Z",
  "rentalDays": 2,
  "pickupLocation": {
    "address": "Delhi Airport",
    "city": "Delhi",
    "zipCode": "110001"
  },
  "dropoffLocation": {
    "address": "Hotel",
    "city": "Delhi",
    "zipCode": "110001"
  },
  "insuranceType": "basic",
  "paymentMethod": "credit_card"
}
```

**Step 6: Get My Bookings**
```
GET {{baseUrl}}/bookings/my-bookings
Headers:
  Authorization: Bearer {{accessToken}}
```

**Step 7: Submit Feedback**
```
POST {{baseUrl}}/bookings/{{bookingId}}/feedback
Headers:
  Authorization: Bearer {{accessToken}}

Body (raw JSON):
{
  "rating": 5,
  "comment": "Excellent service!"
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "statusCode": 400,
  "data": null,
  "message": "Error message here",
  "success": false,
  "errors": []
}
```

Common Error Codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

---

## Project Structure

```
src/
├── controllers/
│   ├── authController.js      # User authentication logic
│   ├── vehicleController.js   # Vehicle management logic
│   └── bookingController.js   # Booking management logic
├── models/
│   ├── User.js                # User schema
│   ├── Vehicle.js             # Vehicle schema
│   └── Booking.js             # Booking schema
├── middlewares/
│   ├── auth.js                # JWT verification
│   ├── errorHandler.js        # Error handling
│   └── validation.js          # Request validation
├── routes/
│   ├── authRoutes.js          # Auth endpoints
│   ├── vehicleRoutes.js       # Vehicle endpoints
│   └── bookingRoutes.js       # Booking endpoints
├── utils/
│   ├── ApiError.js            # Error class
│   ├── ApiResponse.js         # Response class
│   └── asyncHandler.js        # Async wrapper
├── db/
│   └── index.js               # Database connection
├── app.js                     # Express app setup
├── index.js                   # Server entry point
└── constants.js               # Constants
```

---

## Database Schema Overview

### User Schema
- Basic info: username, email, phone, fullName
- Authentication: password (hashed)
- Verification: isEmailVerified, isPhoneVerified
- License: licenseNumber, licenseExpiry
- Address: street, city, state, zipCode, country
- Timestamps: createdAt, updatedAt

### Vehicle Schema
- Basic info: name, type, manufacturer, model, year
- Specifications: color, fuelType, transmission, seatingCapacity
- Pricing: pricePerDay, pricePerHour, insurance, insurancePrice
- Status: isAvailable, status
- Location: address, city, coordinates
- Reviews: rating, reviews array

### Booking Schema
- References: userId, vehicleId
- Dates: pickupDate, dropoffDate
- Pricing: dailyRate, hourlyRate, insurancePrice, totalAmount
- Status: bookingStatus, paymentStatus
- Additional: damageReport, feedback, cancellation details

---

## Next Steps

1. **Setup MongoDB Atlas**
   - Create account and cluster
   - Add connection string to `.env`

2. **Configure JWT Secrets**
   - Generate secure random strings
   - Add to `.env`

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test in Postman**
   - Follow the testing flow above
   - Start with auth endpoints
   - Create test data for vehicles and bookings

5. **Deploy**
   - Push to GitHub
   - Deploy to Heroku, Railway, or similar platform
   - Update MONGO_URI and CORS_ORIGIN

---

## Troubleshooting

### MongoDB Connection Error
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### JWT Token Errors
- Verify JWT secrets are set in `.env`
- Check token expiry time
- Ensure Authorization header format: `Bearer <token>`

### CORS Errors
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- Set `credentials: true` in frontend fetch/axios

### Validation Errors
- Check required fields in request body
- Verify data types match schema
- Check email and phone formats

---

## Support

For issues or questions, please:
1. Check the error message and troubleshooting section
2. Review the API documentation above
3. Check MongoDB and JWT configuration

---

## License

ISC

---

Happy coding! 🚀
