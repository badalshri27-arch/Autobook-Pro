const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const adminRoutes = require("./routes/adminRoutes")
const licenseRoutes = require("./routes/licenseRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const sellerRoutes = require("./routes/sellerRoutes")
const superSellerRoutes = require("./routes/superSellerRoutes")

const Admin = require("./models/Admin")

const app = express()

// ======================
// MIDDLEWARE
// ======================

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.options("*", cors())

app.use(express.json())

// ======================
// DATABASE
// ======================

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log("✅ MongoDB Connected")

  try {

    const existing = await Admin.findOne({
      email: process.env.ADMIN_EMAIL
    })

    if (!existing) {

      const hashed = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      )

      await Admin.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashed
      })

      console.log("✅ Default Admin Created")

    } else {

      console.log("✅ Admin Already Exists")

    }

  } catch (err) {

    console.log("❌ Admin Create Error:", err.message)

  }

})
.catch((err) => {
  console.log("❌ MongoDB Error:", err.message)
})

// ======================
// MAIN ROUTES
// ======================

app.use("/api/admin", adminRoutes)
app.use("/api/license", licenseRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/seller", sellerRoutes)
app.use("/api/superseller", superSellerRoutes)
// ======================
// ADMIN FRONTEND COMPATIBILITY ROUTE
// ======================

app.post(
  "/api/admin/add-credits",
  (req, res, next) => {
    req.url = "/credits/add"
    next()
  },
  adminRoutes
)

// ======================
// FRONTEND COMPATIBLE EXTRA ROUTES
// ======================

// ADD CREDITS
app.post(
  "/api/superseller/add-credits",
  (req, res, next) => {
    req.url = "/credits/add"
    next()
  },
  superSellerRoutes
)

// PAY LICENSE
app.post(
  "/api/superseller/pay-license",
  (req, res, next) => {
    req.url = "/license/pay"
    next()
  },
  superSellerRoutes
)

// UNPAID LICENSES
app.get(
  "/api/superseller/unpaid-licenses/:superSellerId",
  (req, res, next) => {
    req.url = `/unpaid/${req.params.superSellerId}`
    next()
  },
  superSellerRoutes
)

// ALL LICENSES
app.get(
  "/api/superseller/all-licenses/:superSellerId",
  (req, res, next) => {
    req.url = `/alllicenses/${req.params.superSellerId}`
    next()
  },
  superSellerRoutes
)

// CREDIT LOGS
app.get(
  "/api/superseller/credit-logs/:id",
  (req, res, next) => {
    req.url = `/creditlogs/${req.params.id}`
    next()
  },
  superSellerRoutes
)

// ======================
// HOME
// ======================

app.get("/", (req, res) => {
  res.send("🚀 AutoBook Pro API Running")
})

// ======================
// SERVER
// ======================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`)
})