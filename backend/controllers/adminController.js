const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const createSuperAdmin =
async (req, res) => {

    try {

        const hashedPassword =
        await bcrypt.hash("123456", 10)

        const admin =
        await Admin.create({

            name: "Main Admin",

            email: "admin@gmail.com",

            password: hashedPassword,

            role: "super_admin"
        })

        res.json(admin)

    } catch (error) {

        res.json({
            message: error.message
        })
    }
}

const loginAdmin =
async (req, res) => {

    try {

        const { email, password } = req.body

        const admin =
        await Admin.findOne({ email })

        if (!admin) {

            return res.json({
                message: "Admin Not Found"
            })
        }

        const match =
        await bcrypt.compare(
            password,
            admin.password
        )

        if (!match) {

            return res.json({
                message: "Wrong Password"
            })
        }

        const token = jwt.sign({

            id: admin._id,

            role: admin.role

        },
        "mysecretkey",
        {
            expiresIn: "7d"
        })

        res.json({
            token,
            admin
        })

    } catch (error) {

        res.json({
            message: error.message
        })
    }
}
const createSuperSeller =
async (req, res) => {

    try {

        if (
            req.admin.role !==
            "super_admin"
        ) {

            return res.json({
                message:
                "Only Super Admin Allowed"
            })
        }

        const {
            name,
            email,
            password
        } = req.body

        const hashedPassword =
        await bcrypt.hash(password, 10)

        const seller =
        await Admin.create({

            name,

            email,

            password: hashedPassword,

            role: "super_seller"
        })

        res.json(seller)

    } catch (error) {

        res.json({
            message: error.message
        })
    }
}

module.exports = {
    createSuperAdmin,
    loginAdmin,
    createSuperSeller
}