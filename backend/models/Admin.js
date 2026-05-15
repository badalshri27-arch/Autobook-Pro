const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    role: {
        type: String,
        enum: [
            "super_admin",
            "super_seller",
            "seller"
        ],
        default: "seller"
    }

})

module.exports =
mongoose.model("Admin", adminSchema)