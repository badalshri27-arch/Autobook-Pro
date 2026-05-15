const mongoose = require("mongoose")

const licenseSchema =
new mongoose.Schema({

    licenseKey: {
        type: String,
        unique: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },

    deviceId: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: [
            "active",
            "blocked"
        ],
        default: "active"
    },

    expireAt: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports =
mongoose.model(
    "License",
    licenseSchema
)