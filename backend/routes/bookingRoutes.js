const express =
require('express')

const router =
express.Router()

const {

  createBooking,
  getBookings

} = require(
'../controllers/bookingController'
)

// CREATE BOOKING

router.post(
  '/create',
  createBooking
)

// GET BOOKINGS

router.get(
  '/',
  getBookings
)

module.exports = router