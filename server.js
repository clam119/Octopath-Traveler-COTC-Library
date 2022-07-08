if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express') 
const app = express()
const expressLayouts = require('express-ejs-layouts') 
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const charactersRouter = require('./routes/characters')
const affiliationsRouter = require('./routes/affiliations')
const jobclassRouter = require('./routes/jobclass')
const raritiesRouter = require('./routes/rarity')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout') //Create layout file with all files in here so you don't have to duplicate header/footers

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewURLParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/affiliations', affiliationsRouter)
app.use('/characters', charactersRouter)
app.use('/rarities', raritiesRouter)
app.use('/jobclasses', jobclassRouter)

app.listen(process.env.PORT || 3000) //Will listen to port in the environment that it's hosted on, default to 3000 for production.