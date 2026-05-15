const SuperSeller = require("../models/SuperSeller")
const Seller = require("../models/Seller")
const Booking = require("../models/Booking")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.createSuperSeller = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await SuperSeller.findOne({ email })
    if (existing) return res.status(400).json({ error: "Email already exists" })
    const hashed = await bcrypt.hash(password, 10)
    const ss = await SuperSeller.create({ name, email, password: hashed })
    res.json({ success: true, ss })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllSuperSellers = async (req, res) => {
  try {
    const list = await SuperSeller.find().select("-password")
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteSuperSeller = async (req, res) => {
  try {
    await SuperSeller.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.toggleSuperSeller = async (req, res) => {
  try {
    const ss = await SuperSeller.findById(req.params.id)
    ss.status = ss.status === "active" ? "blocked" : "active"
    await ss.save()
    res.json({ success: true, status: ss.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.loginSuperSeller = async (req, res) => {
  try {
    const { email, password } = req.body
    const ss = await SuperSeller.findOne({ email })
    if (!ss) return res.status(404).json({ error: "Not found" })
    if (ss.status === "blocked") return res.status(403).json({ error: "Account blocked" })
    const match = await bcrypt.compare(password, ss.password)
    if (!match) return res.status(401).json({ error: "Wrong password" })
    const token = jwt.sign(
      { id: ss._id, role: "superseller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    res.json({ success: true, token, name: ss.name, id: ss._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getSuperSellerStats = async (req, res) => {
  try {
    const { id } = req.params
    const sellers = await Seller.find({ createdBy: id })
    const sellerIds = sellers.map(s => s._id)
    const bookings = await Booking.find({ sellerId: { $in: sellerIds } })
    res.json({
      totalSellers: sellers.length,
      totalBookings: bookings.length,
      revenue: bookings.reduce((a, b) => a + (b.amount || 0), 0)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}