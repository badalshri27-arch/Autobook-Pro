const SuperSeller = require("../models/SuperSeller")
const Seller = require("../models/Seller")
const Booking = require("../models/Booking")
const License = require("../models/License")
const CreditLog = require("../models/CreditLog")
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
    const ss = await SuperSeller.findById(id).select("-password")
    const sellers = await Seller.find({ createdBy: id })
    const sellerIds = sellers.map(s => s._id)
    const bookings = await Booking.find({ sellerId: { $in: sellerIds } })
    const licenses = await License.find({ createdBy: { $in: sellerIds } })
    const paidKeys = licenses.filter(l => l.paymentStatus === "paid").length
    const unpaidKeys = licenses.filter(l => l.paymentStatus === "unpaid").length
    res.json({
      credits: ss.credits,
      totalSellers: sellers.length,
      totalBookings: bookings.length,
      totalKeys: licenses.length,
      paidKeys,
      unpaidKeys,
      revenue: bookings.reduce((a, b) => a + (b.amount || 0), 0)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addCreditsToSeller = async (req, res) => {
  try {
    const { sellerId, credits, superSellerId } = req.body
    if (!credits || credits <= 0)
      return res.status(400).json({ error: "Invalid credits" })
    const ss = await SuperSeller.findById(superSellerId)
    if (!ss) return res.status(404).json({ error: "Super Seller not found" })
    if (ss.credits < credits)
      return res.status(400).json({ error: `Insufficient credits. You have only ${ss.credits}` })
    const seller = await Seller.findById(sellerId)
    if (!seller) return res.status(404).json({ error: "Seller not found" })
    ss.credits -= Number(credits)
    seller.credits += Number(credits)
    await ss.save()
    await seller.save()
    await CreditLog.create({
      fromRole: "superseller",
      fromId: ss._id,
      fromName: ss.name,
      toRole: "seller",
      toId: seller._id,
      toName: seller.name,
      credits: Number(credits),
      note: `Credits transferred to seller ${seller.name}`,
      type: "add"
    })
    res.json({
      success: true,
      superSellerBalance: ss.credits,
      sellerBalance: seller.credits
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.payLicense = async (req, res) => {
  try {
    const { licenseId, superSellerId } = req.body
    const ss = await SuperSeller.findById(superSellerId)
    if (!ss) return res.status(404).json({ error: "Super Seller not found" })
    if (ss.credits < 1)
      return res.status(400).json({ error: "Insufficient credits. Contact Admin." })
    const license = await License.findById(licenseId)
    if (!license) return res.status(404).json({ error: "License not found" })
    if (license.paymentStatus === "paid")
      return res.status(400).json({ error: "Already paid" })
    ss.credits -= 1
    license.paymentStatus = "paid"
    await ss.save()
    await license.save()
    await CreditLog.create({
      fromRole: "superseller",
      fromId: ss._id,
      fromName: ss.name,
      toRole: "license",
      toId: license._id,
      toName: license.licenseKey,
      credits: 1,
      note: `Key ${license.licenseKey} activated`,
      type: "deduct"
    })
    res.json({ success: true, remainingCredits: ss.credits })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getUnpaidLicenses = async (req, res) => {
  try {
    const { superSellerId } = req.params
    const sellers = await Seller.find({ createdBy: superSellerId })
    const sellerIds = sellers.map(s => s._id)
    const unpaid = await License.find({
      createdBy: { $in: sellerIds },
      paymentStatus: "unpaid"
    }).populate("createdBy", "name")
    res.json(unpaid)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllLicensesBySuperSeller = async (req, res) => {
  try {
    const { superSellerId } = req.params
    const sellers = await Seller.find({ createdBy: superSellerId })
    const sellerIds = sellers.map(s => s._id)
    const licenses = await License.find({
      createdBy: { $in: sellerIds }
    }).populate("createdBy", "name")
    res.json(licenses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getMyCreditLogs = async (req, res) => {
  try {
    const logs = await CreditLog.find({
      $or: [{ fromId: req.params.id }, { toId: req.params.id }]
    }).sort({ createdAt: -1 })
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}