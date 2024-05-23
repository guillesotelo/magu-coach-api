const mongoose = require('mongoose')

const mailListSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number | String
    },
    country: {
        type: String
    },
    age: {
        type: Number | String
    },
    name: {
        type: String
    },
    serviceId: {
        type: String
    },
    service: {
        type: String
    },
    otherData: {
        type: String
    },
}, { timestamps: true })

const MailList = mongoose.model('MailList', mailListSchema)

module.exports = MailList