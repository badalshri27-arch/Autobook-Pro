const Booking =
require('../models/Booking')

const License =
require('../models/License')

// CREATE BOOKING

const createBooking =
async(req,res)=>{

  try{

    const{

      licenseKey,
      userName,
      trainNumber,
      pnr,
      amount

    } = req.body

    // CHECK LICENSE

    const checkLicense =
    await License.findOne({
      licenseKey
    })

    if(!checkLicense){

      return res.status(404)
      .json({

        message:
        'Invalid License'

      })

    }

    // SAVE BOOKING

    const booking =
    await Booking.create({

      licenseKey,

      sellerId:
      checkLicense.createdBy,

      userName,

      trainNumber,

      pnr,

      amount

    })

    res.json({

      message:
      'Booking Saved',

      booking

    })

  }

  catch(error){

    res.status(500)
    .json({

      message:
      error.message

    })

  }

}

// GET BOOKINGS

const getBookings =
async(req,res)=>{

  try{

    const bookings =
    await Booking.find()

    res.json(bookings)

  }

  catch(error){

    res.status(500)
    .json({

      message:
      error.message

    })

  }

}

module.exports = {

  createBooking,

  getBookings

}