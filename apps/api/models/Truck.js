const mongoose = require('mongoose')

const TruckSchema = require('./../schemas/Truck')

module.exports = mongoose.model('Truck', TruckSchema)
