const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    messages: {
        type: String
    },
    date: {
        type: Date
    },
    removed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message