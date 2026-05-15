const express = require("express")
const router = express.Router()
const ctrl = require("../controllers/superSellerController")

router.post("/create", ctrl.createSuperSeller)
router.get("/", ctrl.getAllSuperSellers)
router.delete("/:id", ctrl.deleteSuperSeller)
router.put("/toggle/:id", ctrl.toggleSuperSeller)
router.post("/login", ctrl.loginSuperSeller)
router.get("/stats/:id", ctrl.getSuperSellerStats)
router.post("/credits/add", ctrl.addCreditsToSeller)
router.post("/license/pay", ctrl.payLicense)
router.get("/unpaid/:superSellerId", ctrl.getUnpaidLicenses)
router.get("/alllicenses/:superSellerId", ctrl.getAllLicensesBySuperSeller)
router.get("/creditlogs/:id", ctrl.getMyCreditLogs)

module.exports = router