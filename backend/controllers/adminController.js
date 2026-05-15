const Admin = require("../models/Admin")
const SuperSeller = require("../models/SuperSeller")
const CreditLog = require("../models/CreditLog")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await Admin.findOne({ email })
    if (existing) return res.status(400).json({ error: "Admin already exists" })
    const hashed = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, password: hashed })
    res.json({ success: true, admin })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ error: "Admin not found" })
    const match = await bcrypt.compare(password, admin.password)
    if (!match) return res.status(401).json({ error: "Wrong password" })
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    res.json({ success: true, token, name: admin.name, id: admin._id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.addCreditsToSuperSeller = async (req, res) => {
  try {
    const { superSellerId, credits, note } = req.body
    if (!credits || credits <= 0)
      return res.status(400).json({ error: "Invalid credits" })
    const ss = await SuperSeller.findById(superSellerId)
    if (!ss) return res.status(404).json({ error: "Super Seller not found" })
    ss.credits += Number(credits)
    await ss.save()
    await CreditLog.create({
      fromRole: "admin",
      fromName: "Admin",
      toRole: "superseller",
      toId: ss._id,
      toName: ss.name,
      credits: Number(credits),
      note: note || "Admin added credits",
      type: "add"
    })
    res.json({ success: true, newBalance: ss.credits })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCreditLogs = async (req, res) => {
  try {
    const logs = await CreditLog.find().sort({ createdAt: -1 }).limit(200)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}