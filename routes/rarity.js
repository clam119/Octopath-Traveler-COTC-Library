const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Jobclass = require('../models/jobclass')
const Rarity = require('../models/rarity')
const Affiliation = require('../models/Affiliation')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Rarity Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.rarity != null && req.query.rarity !== '') {
    searchOptions.rarity = new RegExp(req.query.rarity, 'i')
  }
  try {
    const rarity = await Rarity.find(searchOptions)
    res.render('rarities/index', {
      rarities: rarities,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Rarity Route
router.get('/new', (req, res) => {
  res.render('rarities/new', { rarity: new Rarity() })
})

// Create Rarity Route
router.post('/', async (req, res) => {
  const rarity = new Rarity({
    rarity: req.body.rarity
  })
  try {
    const newRarity = await rarity.save()
    res.redirect(`rarities/${newRarity.id}`)
  } catch {
    res.render('rarities/new', {
      rarity: rarity,
      errorMessage: 'Error creating rarity'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const rarity = await Rarity.findById(req.params.id)
    const characters = await Character.find({ character: rarity.id }).limit(6).exec()
    res.render('rarity/show', {
      character: character,
      charactersByRarity: rarities
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const Rarity = await Rarity.findById(req.params.id)
    res.render('rarities/edit', { rarity: rarity })
  } catch {
    res.redirect('/rarities')
  }
})

router.put('/:id', async (req, res) => {
  let rarity
  try {
    rarity = await Rarity.findById(req.params.id)
    rarity.name = req.body.rarity
    await rarity.save()
    res.redirect(`/rarities/${rarity.id}`)
  } catch {
    if (rarity == null) {
      res.redirect('/')
    } else {
      res.render('rarities/edit', {
        rarity: rarity,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let rarity
  try {
    rarity = await Rarity.findById(req.params.id)
    await rarity.remove()
    res.redirect('/rarities')
  } catch {
    if (rarity == null) {
      res.redirect('/')
    } else {
      res.redirect(`/rarities/${rarity.id}`)
    }
  }
})

module.exports = router