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

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected")
    try {
      const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL })
      if (!existing) {
        const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
        await Admin.create({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          password: hashed
        })
        console.log("✅ Admin Created:", process.env.ADMIN_EMAIL)
      } else {
        console.log("✅ Admin Already Exists")
      }
    } catch (err) {
      console.log("Admin Error:", err.message)
    }
  })
  .catch((err) => console.log("MongoDB Error:", err))

app.use("/api/admin", adminRoutes)
app.use("/api/license", licenseRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/seller", sellerRoutes)
app.use("/api/superseller", superSellerRoutes)

app.get("/", (req, res) => res.send("AutoBook Pro API Running"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`))