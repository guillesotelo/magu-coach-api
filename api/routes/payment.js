const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
const { Booking, MailList, Event } = require('../db/models')
const { sendPurchaseEmail, sendPurchaseCoachingEmail, sendPurchaseEntrenamientoEmail } = require('../helpers/mailer')
dotenv.config()
const {
    REACT_APP_STRIPE_SECRET,
    REACT_APP_STRIPE_PUBLIC
} = process.env
const stripe = require("stripe")(REACT_APP_STRIPE_SECRET)

router.post('/create-checkout-session', async (req, res, next) => {
    try {
        const { items, locale } = req.body
        const { rawData } = items[0]
        const booking = await Booking.create({ ...items[0], ...rawData })

        const session = await stripe.checkout.sessions.create({
            locale,
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map(item => {
                const {
                    name,
                    priceInCents,
                    quantity,
                    image,
                    description,
                    currency
                } = item
                return {
                    price_data: {
                        currency: currency || "usd",
                        product_data: {
                            name,
                            description,
                            images: [image],
                            // metadata: { ...item }
                        },
                        unit_amount: priceInCents,
                    },
                    quantity,
                }
            }),
            success_url: `${process.env.REACT_APP_URL}/successPayment?bookingId=${booking._id}`,
            cancel_url: `${process.env.REACT_APP_URL}/checkout`,
        })

        if (booking && session && session.url) return res.json({ url: session.url })

        res.json({ url: 'https://angelita.vercel.app/checkoutError' })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})

router.post('/confirmPayment', async (req, res, next) => {
    try {
        const { _id } = req.body
        let booking = await Booking.findById(_id)

        if (booking && !booking.isPaid) {
            const updated = await Booking.findByIdAndUpdate(_id, { isPaid: true }, { returnDocument: "after", useFindAndModify: false })
            if (!updated) res.status(404).json({ error: 'Error updating booking' })

            const newMail = { ...updated }
            delete newMail._id
            await MailList.create(newMail)

            if (booking.isEvent && booking.eventId) {
                const event = await Event.findById(booking.eventId)
                if (event) {
                    await Event.findByIdAndUpdate(event._id,
                        { participants: event.participants + 1 },
                        { returnDocument: "after", useFindAndModify: false })
                }
            }
            const { username, email, name } = booking
            if (name === 'Coaching') await sendPurchaseCoachingEmail(username, booking, email)
            else if (name === 'Entrenamiento Diario Personal') await sendPurchaseEntrenamientoEmail(username, Booking, email)
            else await sendPurchaseEmail(username, booking, email)
        }

        res.json(booking)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
    }
})


router.get('/getPublicKey', (req, res) => {
    res.json({
        key: REACT_APP_STRIPE_PUBLIC
    })
})

module.exports = router
