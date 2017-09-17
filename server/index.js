import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'

import Amadeus from './amadeus'

const app = express()
app.use(bodyParser.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

const url = 'mongodb://localhost/dbname'

MongoClient.connect(url, (err, db) => {
  console.log('Connected to MongoDB!')
})

const AmadeusApp = new Amadeus()

app.post('/api/points-of-interest', (req, res) => {
  AmadeusApp.pointsOfInterest(req, res)
})

app.post('/api/location-data', (req, res) => {
  AmadeusApp.getDataFromLocation(req, res)
})

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(3000)
