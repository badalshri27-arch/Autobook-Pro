const mongoose = require("mongoose")

const licenseSchema = new mongoose.Schema({
  licenseKey: { type: String, required: true, unique: true },
  status: { type: String, default: "active" },
  paymentStatus: { type: String, default: "unpaid" },
  expireAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" }
}, { timestamps: true })

module.exports = mongoose.model("License", licenseSchema)