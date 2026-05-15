const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// REGISTER ADMIN

exports.registerAdmin = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body

    const existing =
    await Admin.findOne({
      email
    })

    if(existing){

      return res.status(400).json({
        error:"Admin already exists"
      })

    }

    const hashed =
    await bcrypt.hash(
      password,
      10
    )

    const admin =
    await Admin.create({

      name,
      email,
      password:hashed

    })

    res.json({

      success:true,
      admin

    })

  } catch (err) {

    res.status(500).json({
      error:err.message
    })

  }

}

// LOGIN ADMIN

exports.loginAdmin = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body

    const admin =
    await Admin.findOne({
      email
    })

    if(!admin){

      return res.status(404).json({
        error:"Admin not found"
      })

    }

    const match =
    await bcrypt.compare(
      password,
      admin.password
    )

    if(!match){

      return res.status(401).json({
        error:"Wrong password"
      })

    }

    const token =
    jwt.sign(

      {
        id:admin._id,
        role:"admin"
      },

      process.env.JWT_SECRET,

      {
        expiresIn:"7d"
      }

    )

    res.json({

      success:true,
      token,
      name:admin.name,
      id:admin._id

    })

  } catch (err) {

    res.status(500).json({
      error:err.message
    })

  }

}

// CREATE MAIN ADMIN

const createMainAdmin = async () => {

  try {

    const existingAdmin =
    await Admin.findOne({

      email:
      process.env.MAIN_ADMIN_EMAIL

    })

    if(existingAdmin){

      console.log(
        'Main Admin Already Exists'
      )

      return

    }

    const hashedPassword =
    await bcrypt.hash(

      process.env.MAIN_ADMIN_PASSWORD,

      10

    )

    await Admin.create({

      name:'Main Admin',

      email:
      process.env.MAIN_ADMIN_EMAIL,

      password:hashedPassword,

      role:'admin'

    })

    console.log(
      'Main Admin Created'
    )

  } catch (err) {

    console.log(err)

  }

}

createMainAdmin()

module.exports = {

  registerAdmin:
  exports.registerAdmin,

  loginAdmin:
  exports.loginAdmin,

  createMainAdmin

}