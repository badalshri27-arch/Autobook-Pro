const Seller = require("../models/Seller")
const License = require("../models/License")
const Booking = require("../models/Booking")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.createSeller = async (req, res) => {
  try {
    const { name, email, password, superSellerId } = req.body
    const existing = await Seller.findOne({ email })
    if (existing) return res.status(400).json({ error: "Email already exists" })
    const hashed = await bcrypt.hash(password, 10)
    const seller = await Seller.create({
      name, email, password: hashed, createdBy: superSellerId
    })
    res.json({ success: true, seller })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllSellers = async (req, res) => {
  try {
    const list = await Seller.find().populate("createdBy", "name email").select("-password")
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getSellersBySuperSeller = async (req, res) => {
  try {
    const list = await Seller.find({ createdBy: req.params.superSellerId }).select("-password")
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.toggleSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id)
    seller.status = seller.status === "active" ? "blocked" : "active"
    await seller.save()
    res.json({ success: true, status: seller.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body
    const seller = await Seller.findOne({ email })
    if (!seller) return res.status(404).json({ error: "Not found" })
    if (seller.status === "blocked") return res.status(403).json({ error: "Account blocked" })
    const match = await bcrypt.compare(password, seller.password)
    if (!match) return res.status(401).json({ error: "Wrong password" })
    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    res.json({ success: true, token, name: seller.name, id: seller._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getSellerStats = async (req, res) => {
  try {
    const { id } = req.params
    const licenses = await License.find({ createdBy: id })
    const bookings = await Booking.find({ sellerId: id })
    res.json({
      totalLicenses: licenses.length,
      totalBookings: bookings.length,
      revenue: bookings.reduce((a, b) => a + (b.amount || 0), 0)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}