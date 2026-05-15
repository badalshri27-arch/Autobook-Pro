const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const adminRoutes =
require("./routes/adminRoutes")
const licenseRoutes =
require("./routes/licenseRoutes")
const bookingRoutes =
require('./routes/bookingRoutes')

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected")
})
.catch((err) => {
    console.log(err)
})

app.use("/api/admin", adminRoutes)

app.use(
    "/api/license",
    licenseRoutes
)
app.use(
  '/api/booking',
  bookingRoutes
)
app.get("/", (req, res) => {
    res.send("License System Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`)
})