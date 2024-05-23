const dotenv = require('dotenv')
const express = require('express')
const router = express.Router()
const { Subscription, MailList, Message } = require('../db/models')
const { sendContactEmail, sendNewMessageEmail } = require('../helpers/mailer')
const { encrypt, decrypt } = require('../helpers')
const { REACT_APP_URL } = process.env
const jwt = require('jsonwebtoken')
dotenv.config()
const { JWT_SECRET } = process.env
const { verifyToken } = require('../helpers')

//New subscription
router.post('/subscribe', async (req, res, next) => {
    try {
        const emailRegistered = await Subscription.findOne({ email }).exec()
        if (emailRegistered) return res.status(401).send('Email already subscripted')

        const newSubscription = await Subscription.create(req.body)
        if (!newSubscription) return res.status(400).send('Bad request')

        await MailList.create(req.body)

        res.status(201).send(`Subscribed successfully`)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(500).send('Server Error')
    }
})

//Send Contact Email
router.post('/sendContactEmail', async (req, res, next) => {
    try {
        await sendContactEmail('Florencia Bernero', req.body, 'guille.sotelo.cloud@gmail.com')
        await MailList.create(req.body)
        res.status(201).json({ message: 'ok' })
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(500).send('Server Error')
    }
})

// Update or create message session
router.post('/updateMessageSession', async (req, res, next) => {
    try {
        const { _id, messages } = req.body
        let session = null

        if (_id) session = await Message.findByIdAndUpdate(_id, { messages }, { returnDocument: "after", useFindAndModify: false })
        else {
            session = await Message.create({ messages })
            await sendNewMessageEmail()
        }

        res.status(201).json(session)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(500).send('Server Error')
    }
})

// Update or create message session
router.get('/getSessionMessages', verifyToken, async (req, res, next) => {
    try {
        const sessions = await Message.find().sort({ createdAt: -1 })

        res.status(201).json(sessions)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(500).send('Server Error')
    }
})


//Cancel subscription
router.post('/cancelSubscription', async (req, res, next) => {
    try {
        const emailRegistered = await Subscription.findOne({ email }).exec()
        if (!emailRegistered) return res.status(401).send('Email not found')

        const canceled = await Subscription.findByIdAndUpdate(emailRegistered._id, { isActive: false }, { returnDocument: "after", useFindAndModify: false })
        if (!canceled) return res.status(400).send('Bad request')

        res.status(201).send(`Unsubscribed successfully`)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.status(500).send('Server Error')
    }
})

module.exports = router