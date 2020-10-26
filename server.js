const express = require('express')
const cors = require('cors')
const logger = require('morgan')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(logger('dev'))

require('./startup/authentication')(app)
require('./startup/routes')(app)
require('./startup/error')(app)

module.exports = app