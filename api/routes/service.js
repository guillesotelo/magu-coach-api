const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
const { Service } = require('../db/models')

//Get all services
router.get('/getAll', async (req, res, next) => {
    try {
        const services = await Service.find({
            $or: [
                { removed: false },
                { removed: { $exists: false } }
            ]
        }).sort({ createdAt: -1 })
        if (!services) return res.status(404).send('No services found.')

        res.status(200).json(services)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Get service by ID
router.get('/getById', async (req, res, next) => {
    try {
        const { _id } = req.query
        const service = await Service.findById(_id)
        if (!service) return res.status(404).send('Post not found.')

        res.status(200).json(service)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Create new service
router.post('/create', async (req, res, next) => {
    try {
        const newservice = await Service.create(req.body)
        if (!newservice) return res.status(400).json('Error creating post')

        res.status(200).json(newservice)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Update service Data
router.post('/update', async (req, res, next) => {
    try {
        const { _id } = req.body
        let serviceData = { ...req.body }

        const updated = await Service.findByIdAndUpdate(_id, serviceData, { returnDocument: "after", useFindAndModify: false })
        if (!updated) return res.status(404).send('Error updating Service.')

        res.status(200).json(updated)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})

//Update service Data
router.post('/remove', async (req, res, next) => {
    try {
        const { _id } = req.body

        const deleted = await Service.findByIdAndUpdate(_id, { removed: true }, { returnDocument: "after", useFindAndModify: false })

        res.status(200).json(deleted)
    } catch (err) {
        console.error('Something went wrong!', err)
        res.send(500).send('Server Error')
    }
})


module.exports = router