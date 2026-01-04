# Postman Testing Guide for GoMoto API

## 📥 Import Collection

1. Open Postman
2. Click **Import** button (top-left)
3. Select file: `GoMoto_API_Collection.postman_collection.json`
4. Click **Import**

---

## 🔧 Setup Environment Variables

In Postman, create an Environment with these variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `baseUrl` | `http://localhost:8000/api` | Keep as is |
| `accessToken` | (empty) | Fill from login response |
| `adminToken` | (empty) | For admin endpoints |
| `vehicleId` | (empty) | From create vehicle |
| `bookingId` | (empty) | From create booking |

**How to set variables:**
1. Click Environment selector (top-right)
2. Click **Create New** environment
3. Add above variables
4. Save

---

## ✅ Complete Testing Flow

### Phase 1: Authentication

#### 1.1 Register User
```
Endpoint: POST /auth/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Test@123456",
  "fullName": "John Doe",
  "phone": "+919876543210"
}
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "xxx",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "message": "User registered successfully",
  "success": true
}
```

**Save:** `_id` as `userId`

---

#### 1.2 Login
```
Endpoint: POST /auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Test@123456"
}
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

**⚠️ IMPORTANT:** 
- Copy `accessToken` 
- Go to **Environment** → Set `accessToken` variable
- This token is needed for protected routes

---

#### 1.3 Get Current User
```
Endpoint: GET /auth/me
Headers: Authorization: Bearer {{accessToken}}
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "xxx",
    "email": "john@example.com",
    "username": "john_doe"
  },
  "message": "User fetched successfully",
  "success": true
}
```

✅ **Confirms authentication is working**

---

#### 1.4 Update Profile (Optional)
```
Endpoint: PUT /auth/profile
Headers: Authorization: Bearer {{accessToken}}
```

**Body:**
```json
{
  "fullName": "John Doe Updated",
  "phone": "+919876543210",
  "licenseNumber": "DL01AB1234567",
  "licenseExpiry": "2025-12-31"
}
```

---

### Phase 2: Vehicle Management

#### 2.1 Create Vehicle (Admin)
```
Endpoint: POST /vehicles/
Headers: Authorization: Bearer {{adminToken}}
```

⚠️ **Need Admin Token:**
- If you don't have admin token, ask your admin
- Or contact backend developer
- For testing, you can use your current token if you have admin role

**Body:**
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
  "description": "Great bike for city",
  "features": ["ABS", "Digital Dashboard"],
  "insurance": "basic",
  "insurancePrice": 50,
  "location": {
    "address": "Main Station",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001"
  }
}
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "vehicle_id_xyz",
    "name": "Honda CB 150",
    "type": "bike",
    "registrationNumber": "DL01AB1234",
    "pricePerDay": 500,
    "isAvailable": true
  },
  "message": "Vehicle created successfully",
  "success": true
}
```

**Save:** `_id` as `vehicleId` environment variable

---

#### 2.2 Get All Vehicles
```
Endpoint: GET /vehicles/all
```

**Query Parameters:**
- `page=1` (optional)
- `limit=10` (optional)
- `type=bike` (optional - filter by type)

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "vehicles": [
      {
        "_id": "...",
        "name": "Honda CB 150",
        "type": "bike",
        "pricePerDay": 500,
        "isAvailable": true
      }
    ],
    "total": 1,
    "page": 1,
    "pages": 1
  },
  "message": "Vehicles fetched successfully",
  "success": true
}
```

---

#### 2.3 Get Vehicles by Type
```
Endpoint: GET /vehicles/type/bike
```

Or try: `car`, `truck`, `jcb`

---

#### 2.4 Get Available Vehicles
```
Endpoint: GET /vehicles/available
```

Only returns vehicles with `isAvailable: true`

---

### Phase 3: Booking Management

#### 3.1 Create Booking
```
Endpoint: POST /bookings/
Headers: Authorization: Bearer {{accessToken}}
```

**Body:**
```json
{
  "vehicleId": "{{vehicleId}}",
  "pickupDate": "2025-02-20T10:00:00Z",
  "dropoffDate": "2025-02-22T10:00:00Z",
  "rentalDays": 2,
  "rentalHours": 0,
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
  "paymentMethod": "credit_card",
  "additionalCharges": [
    {
      "description": "GPS Device",
      "amount": 100
    }
  ]
}
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "booking_id_xyz",
    "bookingId": "GOMOTO1705312000001",
    "userId": "...",
    "vehicleId": "...",
    "rentalDays": 2,
    "totalAmount": 1200,
    "advancePayment": 240,
    "bookingStatus": "pending",
    "paymentStatus": "pending"
  },
  "message": "Booking created successfully",
  "success": true
}
```

**Save:** `_id` as `bookingId` variable

---

#### 3.2 Get My Bookings
```
Endpoint: GET /bookings/my-bookings
Headers: Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
- `page=1` (optional)
- `limit=10` (optional)
- `status=pending` (optional - pending, confirmed, active, completed, cancelled)

**Response:** List of your bookings

---

#### 3.3 Get Booking Details
```
Endpoint: GET /bookings/{{bookingId}}
Headers: Authorization: Bearer {{accessToken}}
```

**Response:** Detailed booking information

---

#### 3.4 Update Booking Status (Admin)
```
Endpoint: PUT /bookings/{{bookingId}}/status
Headers: Authorization: Bearer {{adminToken}}
```

**Body:**
```json
{
  "bookingStatus": "confirmed",
  "paymentStatus": "completed"
}
```

**Valid Statuses:**
- `bookingStatus`: pending, confirmed, active, completed, cancelled
- `paymentStatus`: pending, completed, cancelled

---

#### 3.5 Cancel Booking
```
Endpoint: PUT /bookings/{{bookingId}}/cancel
Headers: Authorization: Bearer {{accessToken}}
```

**Body:**
```json
{
  "cancellationReason": "Trip postponed"
}
```

**Refund Rules:**
- >48 hours before pickup: 80% refund
- 24-48 hours: 50% refund
- <24 hours: No refund

---

### Phase 4: Feedback & Reviews

#### 4.1 Submit Feedback
```
Endpoint: POST /bookings/{{bookingId}}/feedback
Headers: Authorization: Bearer {{accessToken}}
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent vehicle and service!"
}
```

**Rating:** 0-5 stars

---

### Phase 5: Admin Dashboard

#### 5.1 Get All Bookings (Admin)
```
Endpoint: GET /bookings/
Headers: Authorization: Bearer {{adminToken}}
```

**Query Parameters:**
- `page=1`
- `limit=10`
- `status=confirmed` (optional)

---

#### 5.2 Get Booking Statistics (Admin)
```
Endpoint: GET /bookings/stats/all
Headers: Authorization: Bearer {{adminToken}}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "totalBookings": 10,
    "confirmedBookings": 8,
    "completedBookings": 5,
    "cancelledBookings": 1,
    "totalRevenue": 25000
  },
  "message": "Booking statistics fetched successfully",
  "success": true
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "Invalid Access Token"
**Solution:**
- Go to auth/login again
- Copy fresh `accessToken`
- Update environment variable
- Try request again

### Issue: "Only admin can access this route"
**Solution:**
- Need admin token for admin routes
- Use regular token for user routes
- Check Authorization header format: `Bearer <token>`

### Issue: "Vehicle not found"
**Solution:**
- Create a vehicle first
- Copy the `_id` from response
- Use correct `vehicleId` in booking

### Issue: "CORS error in browser"
**Solution:**
- In Postman, CORS doesn't apply
- For frontend, update `CORS_ORIGIN` in `.env`

### Issue: "MongoDB connection failed"
**Solution:**
- Check `.env` MONGO_URI
- Verify MongoDB Atlas connection
- Check IP whitelist

---

## 📊 Testing Checklist

- [ ] Register new user
- [ ] Login and get token
- [ ] Get current user profile
- [ ] Create vehicle (need admin)
- [ ] Get all vehicles
- [ ] Filter vehicles by type
- [ ] Create booking
- [ ] View my bookings
- [ ] Update booking status (admin)
- [ ] Submit feedback
- [ ] View booking stats (admin)

---

## 🎯 Expected Outcomes

After completing all tests:

✅ User registration working
✅ Authentication working
✅ Vehicles showing up
✅ Bookings created successfully
✅ Pricing calculated correctly
✅ Feedback submitted
✅ Admin stats visible

---

## 📝 Tips

1. **Always copy tokens** to environment after login
2. **Use {{}} syntax** for variables in Postman
3. **Check response status** - 200s are success, 400s are errors
4. **Read error messages** - they tell you what's wrong
5. **Keep .env updated** with your MongoDB URI

---

## 🔗 Quick Links

- Full API Docs: See `README.md`
- Quick Setup: See `QUICK_START.md`
- Implementation: See `IMPLEMENTATION_SUMMARY.md`

---

**Happy Testing! 🚀**
