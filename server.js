const express = require('express') 
const app = express()
const expressLayouts = require('express-ejs-layouts') 

const indexRouter = require('./routes/index.js')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') //EJS Templating files
app.set('layout', 'layouts/layout') //Create layout file with all files in here so you don't have to duplicate header/footers

app.use(expressLayouts)
app.use(express.static('public'))
app.use('/', indexRouter)

app.listen(process.env.PORT || 3000) //Will listen to port in the environment that it's hosted on, default to 3000 for production.