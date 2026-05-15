const License = require("../models/License")

exports.createLicense = async (req, res) => {
  try {
    const { licenseKey, expireAt, sellerId } = req.body
    const existing = await License.findOne({ licenseKey })
    if (existing) return res.status(400).json({ error: "Key already exists" })
    const license = await License.create({
      licenseKey, expireAt, createdBy: sellerId
    })
    res.json({ success: true, license })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getAllLicenses = async (req, res) => {
  try {
    const list = await License.find().populate("createdBy", "name")
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getLicensesBySeller = async (req, res) => {
  try {
    const list = await License.find({ createdBy: req.params.sellerId })
    res.json(list)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.verifyLicense = async (req, res) => {
  try {
    const { licenseKey } = req.body
    const license = await License.findOne({ licenseKey }).populate("createdBy")
    if (!license) return res.status(404).json({ valid: false, error: "Invalid key" })
    if (license.status !== "active") return res.status(403).json({ valid: false, error: "Key blocked" })
    if (license.expireAt && new Date() > new Date(license.expireAt))
      return res.status(403).json({ valid: false, error: "Key expired" })
    res.json({
      valid: true,
      sellerId: license.createdBy._id,
      sellerName: license.createdBy.name
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.toggleLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id)
    license.status = license.status === "active" ? "blocked" : "active"
    await license.save()
    res.json({ success: true, status: license.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.deleteLicense = async (req, res) => {
  try {
    await License.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}