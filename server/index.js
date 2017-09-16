import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient, ObjectId } from 'mongodb'
import axios from 'axios'

const app = express()
app.use(bodyParser.json())
app.use('/static', express.static(path.join(__dirname, 'public')))

const url = 'mongodb://localhost/dbname'

MongoClient.connect(url, (err, db) => {
  console.log('Connected to MongoDB!')
})

app.get('/', function (req, res) {
  res.send('Hello world!')
})

app.listen(3000)
