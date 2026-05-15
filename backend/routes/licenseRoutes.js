const express = require("express")
const router = express.Router()
const ctrl = require("../controllers/licenseController")

router.post("/create", ctrl.createLicense)
router.get("/", ctrl.getAllLicenses)
router.get("/by-seller/:sellerId", ctrl.getLicensesBySeller)
router.post("/verify", ctrl.verifyLicense)
router.put("/toggle/:id", ctrl.toggleLicense)
router.delete("/:id", ctrl.deleteLicense)

module.exports = router