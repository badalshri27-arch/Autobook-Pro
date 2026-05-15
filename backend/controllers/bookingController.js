const Booking = require("../models/Booking")
const License = require("../models/License")
const Seller = require("../models/Seller")

exports.createBooking = async (req, res) => {
  try {
    const { userName, trainNumber, pnr, amount, licenseKey } = req.body
    const license = await License.findOne({ licenseKey })
    if (!license) return res.status(404).json({ error: "Invalid license" })
    const seller = await Seller.findById(license.createdBy)
    if (!seller) return res.status(404).json({ error: "Seller not found" })
    const booking = await Booking.create({
      userName, trainNumber, pnr, amount, licenseKey,
      sellerId: seller._id,
      superSellerId: seller.createdBy
    })
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllBookings = async (req, res) => {
  try {
    const list = await Booking.find()
      .populate("sellerId", "name")
      .populate("superSellerId", "name")
      .sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getBookingsBySeller = async (req, res) => {
  try {
    const list = await Booking.find({ sellerId: req.params.sellerId }).sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getBookingsBySuperSeller = async (req, res) => {
  try {
    const list = await Booking.find({ superSellerId: req.params.superSellerId })
      .populate("sellerId", "name")
      .sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}