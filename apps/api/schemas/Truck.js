const mongoose = require('mongoose')

module.exports = mongoose.Schema({
  licensePlate: String,
  width: Number,
  length: Number,
  maxWeight: Number
})
