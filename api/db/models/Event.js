const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: {
        type: String
    },
    serviceId: {
        type: String
    },
    price: {
        type: Number
    },
    currency: {
        type: String
    },
    discount: {
        type: String
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    },
    dateObject: {
        type: String
    },
    date: {
        type: String
    },
    endTime: {
        type: String
    },
    duration: {
        type: Number
    },
    isVirtual: {
        type: Boolean,
        default: true
    },
    link: {
        type: String
    },
    linkPassword: {
        type: String
    },
    participants: {
        type: Number,
        default: 1
    },
    otherData: {
        type: String
    },
    removed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const Event = mongoose.model('Event', eventSchema)

module.exports = Event