const express = require("express")
const router = express.Router()
const ctrl = require("../controllers/bookingController")

router.post("/create", ctrl.createBooking)
router.get("/", ctrl.getAllBookings)
router.get("/by-seller/:sellerId", ctrl.getBookingsBySeller)
router.get("/by-superseller/:superSellerId", ctrl.getBookingsBySuperSeller)

module.exports = router