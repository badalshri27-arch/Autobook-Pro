const express =
require('express')

const router =
express.Router()

const {

  createLicense,
  verifyLicense,
  getLicenses,
  deleteLicense,
  toggleLicenseStatus

} = require(
'../controllers/licenseController'
)

const {
  protect
} = require(
'../middleware/authMiddleware'
)


// CREATE LICENSE

router.post(
  '/create',
  createLicense
)


// VERIFY LICENSE

router.post(
  '/verify',
  verifyLicense
)


// GET ALL LICENSES

router.get(
  '/',
  getLicenses
)


// DELETE LICENSE

router.delete(
  '/:id',
  deleteLicense
)


// BLOCK / UNBLOCK LICENSE

router.put(
  '/toggle/:id',
  toggleLicenseStatus
)

module.exports =
router