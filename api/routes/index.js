const express = require('express')
const router = express.Router()
const { verifyToken } = require('../helpers')

const userRoutes = require('./user')
const appRoutes = require('./app')
const paymentRoutes = require('./payment')
const bookingRoutes = require('./booking')
const serviceRoutes = require('./service')
const eventRoutes = require('./event')

router.use('/user', userRoutes)
router.use('/app', appRoutes)
router.use('/payment', paymentRoutes)
router.use('/booking', bookingRoutes)
router.use('/service', serviceRoutes)
router.use('/event', eventRoutes)

module.exports = router, verifyToken