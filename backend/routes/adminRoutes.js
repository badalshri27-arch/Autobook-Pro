const express = require("express")

const protect =
require("../middleware/authMiddleware")

const {
    createSuperAdmin,
    loginAdmin,
    createSuperSeller
} = require("../controllers/adminController")

const router = express.Router()

router.post(
    "/create-super-admin",
    createSuperAdmin
)

router.post(
    "/login",
    loginAdmin
)

router.post(
    "/create-super-seller",
    protect,
    createSuperSeller
)

module.exports = router