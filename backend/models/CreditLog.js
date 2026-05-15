const mongoose = require("mongoose")

const creditLogSchema = new mongoose.Schema({
  fromRole: { type: String },
  fromId: { type: mongoose.Schema.Types.ObjectId },
  fromName: { type: String },
  toRole: { type: String },
  toId: { type: mongoose.Schema.Types.ObjectId },
  toName: { type: String },
  credits: { type: Number },
  note: { type: String },
  type: { type: String }
}, { timestamps: true })

module.exports = mongoose.model("CreditLog", creditLogSchema)