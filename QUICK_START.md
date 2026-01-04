# GoMoto Backend - Quick Setup Guide

## 🚀 Fast Start (5 minutes)

### Step 1: Update MongoDB Connection
Edit `.env` file and replace with your MongoDB Atlas connection string:

```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net
```

### Step 2: Start the Server
```bash
npm run dev
```

You should see:
```
Server running on port 8000
Mongo DB Connected
```

### Step 3: Test Health Check
Open browser or Postman:
```
GET http://localhost:8000/api/health
```

---

## 📱 Testing in Postman (3 minutes)

### Option 1: Import Collection
1. Open Postman
2. Click `Import`
3. Select `GoMoto_API_Collection.postman_collection.json`
4. Set environment variables (see below)

### Option 2: Manual Testing

**1. Register User**
```
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Test@123456",
  "fullName": "John Doe",
  "phone": "+919876543210"
}
```

**2. Login**
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test@123456"
}
```

Save the `accessToken` from response.

**3. Create Vehicle (Admin)**
```
POST http://localhost:8000/api/vehicles/
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Honda CB 150",
  "type": "bike",
  "registrationNumber": "DL01AB1234",
  "manufacturer": "Honda",
  "model": "CB 150",
  "year": 2023,
  "color": "Red",
  "seatingCapacity": 2,
  "pricePerDay": 500,
  "pricePerHour": 100,
  "fuelType": "petrol"
}
```

Save the `_id` from response.

**4. Create Booking**
```
POST http://localhost:8000/api/bookings/
Authorization: Bearer YOUR_USER_TOKEN
Content-Type: application/json

{
  "vehicleId": "VEHICLE_ID_FROM_STEP_3",
  "pickupDate": "2025-02-20T10:00:00Z",
  "dropoffDate": "2025-02-22T10:00:00Z",
  "rentalDays": 2,
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
  "insuranceType": "basic",
  "paymentMethod": "credit_card"
}
```

---

## 🎯 Features Available

✅ User Registration & Login
✅ Vehicle Management (Create, Read, Update, Delete)
✅ Booking System (Create, Update, Cancel)
✅ Feedback & Reviews
✅ Admin Dashboard (Stats)
✅ Multiple Vehicle Types (Bike, Car, Truck, JCB)
✅ Insurance Management
✅ Payment Tracking
✅ Cancellation Policy with Refunds

---

## 📊 Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/me` | ✅ | Get current user |
| POST | `/vehicles/` | ✅ Admin | Create vehicle |
| GET | `/vehicles/all` | ❌ | Get all vehicles |
| GET | `/vehicles/type/:type` | ❌ | Get by type |
| POST | `/bookings/` | ✅ | Create booking |
| GET | `/bookings/my-bookings` | ✅ | Get my bookings |
| POST | `/bookings/:id/feedback` | ✅ | Submit feedback |

---

## 🔧 Troubleshooting

**Error: MongoDB connection failed**
- Check MONGO_URI in .env
- Verify IP whitelist in MongoDB Atlas
- Check username/password

**Error: Invalid token**
- Login again to get fresh token
- Copy full token (including Bearer)

**Error: Vehicle type not found**
- Ensure type is: bike, car, truck, or jcb

**Error: CORS errors**
- Update CORS_ORIGIN in .env to match your frontend URL

---

## 📝 Environment Setup

All variables in `.env`:
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 8000)
- `CORS_ORIGIN` - Frontend URL
- `ACCESS_TOKEN_SECRET` - JWT secret (min 32 chars)
- `REFRESH_TOKEN_SECRET` - Refresh token secret

---

## 🎓 Next Steps

1. ✅ Verify server is running
2. ✅ Test endpoints in Postman
3. ✅ Create test vehicles
4. ✅ Create test bookings
5. ✅ Submit feedback
6. ✅ Check admin stats

---

## 📖 Full Documentation

See `README.md` for:
- Complete API documentation
- Schema details
- Error handling
- Database structure
- Deployment guide

---

Happy coding! 🚀
