const License =
require('../models/License')

// CREATE LICENSE

const createLicense =
async(req,res)=>{

  try{

    const{
      licenseKey,
      expireAt
    } = req.body

    const license =
await License.create({

  licenseKey,
  expireAt,

  status:'active'

})

    res.json(license)

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}

// VERIFY LICENSE

const verifyLicense =
async(req,res)=>{

  try{

    const{
      licenseKey
    } = req.body

    const checkLicense =
    await License.findOne({
      licenseKey
    })

    if(!checkLicense){

      return res.status(404)
      .json({
        message:'Invalid License'
      })

    }

    if(
      checkLicense.status !==
      'active'
    ){

      return res.status(400)
      .json({
        message:'License Blocked'
      })

    }

    res.json({

      message:'License Valid',

      license:checkLicense

    })

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}

// GET LICENSES

const getLicenses =
async(req,res)=>{

  try{

    const licenses =
    await License.find()

    res.json(licenses)

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}
const deleteLicense =
async(req,res)=>{

  try{

    await License.findByIdAndDelete(
      req.params.id
    )

    res.json({
      message:'License Deleted'
    })

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}

const toggleLicenseStatus =
async(req,res)=>{

  try{

    const license =
    await License.findById(
      req.params.id
    )

    if(!license){

      return res.status(404)
      .json({
        message:'License Not Found'
      })

    }

    if(
      license.status ===
      'active'
    ){

      license.status =
      'blocked'

    }

    else{

      license.status =
      'active'

    }

    await license.save()

    res.json({

      message:'License Updated',

      status:license.status

    })

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}

const blockLicense =
async(req,res)=>{

  try{

    const license =
    await License.findById(
      req.params.id
    )

    if(!license){

      return res.status(404)
      .json({
        message:'License not found'
      })

    }

    license.status =
    license.status === 'active'
    ? 'blocked'
    : 'active'

    await license.save()

    res.json({
      message:'License Updated',
      status:license.status
    })

  }

  catch(error){

    res.status(500)
    .json({
      message:error.message
    })

  }

}
module.exports = {

  createLicense,
  verifyLicense,
  getLicenses,
  deleteLicense,
  toggleLicenseStatus,
  blockLicense

}