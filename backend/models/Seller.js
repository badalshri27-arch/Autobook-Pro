const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, default: "active" },
  credits: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SuperSeller" }
}, { timestamps: true })

module.exports = mongoose.model("Seller", sellerSchema)