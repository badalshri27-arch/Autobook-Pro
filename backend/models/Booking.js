const mongoose = require('mongoose')

const bookingSchema =
new mongoose.Schema({

  licenseKey:{
    type:String,
    required:true
  },

  sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Admin'
  },

  userName:{
    type:String
  },

  trainNumber:{
    type:String
  },

  pnr:{
    type:String
  },

  amount:{
    type:Number
  },

  screenshot:{
    type:String
  },

  bookingTime:{
    type:Date,
    default:Date.now
  }

})

module.exports =
mongoose.model(
  'Booking',
  bookingSchema
)