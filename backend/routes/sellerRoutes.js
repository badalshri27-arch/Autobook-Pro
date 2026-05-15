const express = require("express")
const router = express.Router()
const ctrl = require("../controllers/sellerController")

router.post("/create", ctrl.createSeller)
router.get("/", ctrl.getAllSellers)
router.get("/by-superseller/:superSellerId", ctrl.getSellersBySuperSeller)
router.delete("/:id", ctrl.deleteSeller)
router.put("/toggle/:id", ctrl.toggleSeller)
router.post("/login", ctrl.loginSeller)
router.get("/stats/:id", ctrl.getSellerStats)

module.exports = router