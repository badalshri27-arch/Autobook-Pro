const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  userName: String,
  trainNumber: String,
  pnr: String,
  amount: Number,
  licenseKey: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  superSellerId: { type: mongoose.Schema.Types.ObjectId, ref: "SuperSeller" }
}, { timestamps: true })

module.exports = mongoose.model("Booking", bookingSchema)