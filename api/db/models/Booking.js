const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    serviceId: {
        type: String
    },
    service: {
        type: String
    },
    serviceName: {
        type: String
    },
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    age: {
        type: Number
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    discount: {
        type: String
    },
    dateObjects: {
        type: String
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    otherData: {
        type: String
    },
    removed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking