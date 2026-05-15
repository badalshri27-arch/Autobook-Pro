const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const adminRoutes = require("./routes/adminRoutes")
const licenseRoutes = require("./routes/licenseRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const sellerRoutes = require("./routes/sellerRoutes")
const superSellerRoutes = require("./routes/superSellerRoutes")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

app.use("/api/admin", adminRoutes)
app.use("/api/license", licenseRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/seller", sellerRoutes)
app.use("/api/superseller", superSellerRoutes)

app.get("/", (req, res) => res.send("AutoBook Pro API Running"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server Running On Port ${PORT}`))