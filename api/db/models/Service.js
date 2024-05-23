const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    price: {
        type: Number
    },
    discount: {
        type: String
    },
    days: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    dateObjects: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    isEvent: {
        type: Boolean
    },
    link: {
        type: String
    },
    linkPassword: {
        type: String
    },
    otherData: {
        type: String
    },
    removed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const Service = mongoose.model('Service', serviceSchema)

module.exports = Service