const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Jobclass = require('../models/jobclass')
const Rarity = require('../models/rarity')
const Affiliation = require('../models/Affiliation')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Affiliations Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.affiliation != null && req.query.affiliation !== '') {
    searchOptions.affiliation = new RegExp(req.query.affiliation, 'i')
  }
  try {
    const affiliations = await Affiliation.find(searchOptions)
    res.render('affiliations/index', {
      affiliations: affiliations,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Affiliation Route
router.get('/new', (req, res) => {
  res.render('affiliations/new', { affiliation: new Affiliation() })
})

// Create Affiliation Route
router.post('/', async (req, res) => {
  const affiliation = new Affiliation({
    affiliation: req.body.affiliation
  })
  try {
    const newAffiliation = await affiliation.save()
    res.redirect(`affiliations/${newAffiliation.id}`)
  } catch {
    res.render('affiliations/new', {
      affiliation: affiliation,
      errorMessage: 'Error creating affiliation'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const affiliation = await Affiliation.findById(req.params.id)
    const characters = await Character.find({ character: affiliation.id }).limit(6).exec()
    res.render('affiliation/show', {
      affiliation: affiliation,
      charactersByAffiliations: affiliations
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const Affiliation = await Affiliation.findById(req.params.id)
    res.render('affiliations/edit', { affiliation: affiliation })
  } catch {
    res.redirect('/affiliations')
  }
})

router.put('/:id', async (req, res) => {
  let affiliation
  try {
    affiliation = await Affiliation.findById(req.params.id)
    affiliation.name = req.body.affiliation
    await affiliation.save()
    res.redirect(`/affiliations/${affiliation.id}`)
  } catch {
    if (affiliation == null) {
      res.redirect('/')
    } else {
      res.render('affiliations/edit', {
        affiliation: affiliation,
        errorMessage: 'Error updating Author'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let affiliation
  try {
    affiliation = await Affiliation.findById(req.params.id)
    await affiliation.remove()
    res.redirect('/affiliations')
  } catch {
    if (affiliation == null) {
      res.redirect('/')
    } else {
      res.redirect(`/affiliations/${affiliation.id}`)
    }
  }
})

module.exports = router