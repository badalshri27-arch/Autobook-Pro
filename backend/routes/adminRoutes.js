const express = require("express")
const router = express.Router()
const ctrl = require("../controllers/adminController")

router.post("/register", ctrl.registerAdmin)
router.post("/login", ctrl.loginAdmin)
router.post("/credits/add", ctrl.addCreditsToSuperSeller)
router.get("/credits/logs", ctrl.getCreditLogs)

module.exports = router