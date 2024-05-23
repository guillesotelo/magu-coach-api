const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
const { Event } = require('../db/models')

//Get all events
router.get('/getAll', async (req, res, next) => {
    try {
        const events = await Event.find({
            $or: [
                { removed: false },
                { removed: { $exists: false } }
            ]
        }).sort({ createdAt: -1 })
        if (!events) return res.status(404).send('No events found.')

        res.status(200).json(events)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Get event by ID
router.get('/getById', async (req, res, next) => {
    try {
        const { _id } = req.query
        const event = await Event.findById(_id)
        if (!event) return res.status(404).send('Post not found.')

        res.status(200).json(event)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Create new event
router.post('/create', async (req, res, next) => {
    try {
        const newEvent = await Event.create(req.body)
        if (!newEvent) return res.status(400).json('Error creating post')

        res.status(200).json(newEvent)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Update event Data
router.post('/update', async (req, res, next) => {
    try {
        const { _id } = req.body
        let eventData = { ...req.body }

        const updated = await Event.findByIdAndUpdate(_id, eventData, { returnDocument: "after", useFindAndModify: false })
        if (!updated) return res.status(404).send('Error updating Event.')

        res.status(200).json(updated)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Update event Data
router.post('/remove', async (req, res, next) => {
    try {
        const { _id } = req.body

        const deleted = await Event.findByIdAndUpdate(_id, { removed: true }, { returnDocument: "after", useFindAndModify: false })

        res.status(200).json(deleted)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})


module.exports = router