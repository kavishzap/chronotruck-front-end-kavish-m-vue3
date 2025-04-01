const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { body, param, validationResult } = require('express-validator')

const Truck = require('./models/Truck')

const HOST = process.env.HOST || '0.0.0.0'
const PORT = process.env.PORT || 3000

mongoose.connect('mongodb://root:password@mongo:27017/mongo?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'DB connection failure'))

const app = express()
app.use(express.json())
app.use(cors('*'))

app.post(
  '/trucks',
  body('width')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 240 }),
    body('length')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 1320 }),
    body('maxWeight')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 28000 }),
    body('licensePlate')
    .exists({ checkNull: true })
    .escape()
    .toLowerCase()
    .matches(/^(?!ss|ww|.[iou]|[iou].)[a-z]{2}[-\s]?\d{3}[-\s]?(?!ss|ww|.[iou]|[iou].)[a-z]{2}$/),
  async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { width, length, maxWeight, licensePlate } = req.body

  const truck = await Truck.create({
    width,
    length,
    maxWeight,
    licensePlate
  })

  return res.status(201).send(truck)
})

app.delete(
  '/trucks/:id',
  param('id'),
  async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const truck = await Truck.deleteOne({ _id: req.params.id })
  if (truck && truck.deletedCount) {
    res.status(201).send({})
  } else {
    res.status(404).json({})
  }
})

app.get('/trucks', (req, res) => {
  Truck.find((err, trucks) => {
    res.status(200).send(trucks)
  })
})

app.listen(PORT, HOST, () => {
  console.log(`Running on ${HOST}:${PORT}`)
})

app.put(
  '/trucks/:id',
  body('width')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 240 }),
  body('length')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 1320 }),
  body('maxWeight')
    .exists({ checkNull: true })
    .isInt({ min: 1, max: 28000 }),
  body('licensePlate')
    .exists({ checkNull: true })
    .escape()
    .toLowerCase()
    .matches(/^(?!ss|ww|.[iou]|[iou].)[a-z]{2}[-\s]?\d{3}[-\s]?(?!ss|ww|.[iou]|[iou].)[a-z]{2}$/),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { width, length, maxWeight, licensePlate } = req.body

    try {
      const truck = await Truck.findByIdAndUpdate(
        req.params.id,
        { width, length, maxWeight, licensePlate },
        { new: true } 
      )

      if (!truck) {
        return res.status(404).json({ message: 'Truck not found' })
      }

      return res.status(200).json(truck)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Server error' })
    }
  }
)