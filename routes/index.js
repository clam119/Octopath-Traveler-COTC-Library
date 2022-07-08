const express = require('express')
const router = express.Router()
const Character = require('../models/character')

router.get('/', async (req, res) => {
  let characters
  try {
    characters = await Character.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    characters = []
  }
  res.render('index', { characters: characters })
})

module.exports = router