const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Jobclass = require('../models/jobclass')
const Rarity = require('../models/rarity')
const Affiliation = require('../models/Affiliation')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Jobclass Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.jobclass != null && req.query.jobclass !== '') {
    searchOptions.jobclass = new RegExp(req.query.jobclass, 'i')
  }
  try {
    const jobclass = await Jobclass.find(searchOptions)
    res.render('jobclasses/index', {
      jobclasses: jobclasses,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Jobclass Route
router.get('/new', (req, res) => {
  res.render('jobclasses/new', { class: new Jobclass() })
})

// Create Jobclass Route
router.post('/', async (req, res) => {
  const jobclass = new Jobclass({
    jobclass: req.body.jobclass
  })
  try {
    const newJobclass = await jobclass.save()
    res.redirect(`jobclasses/${newJobclass.id}`)
  } catch {
    res.render('jobclasses/new', {
      jobclass: jobclass,
      errorMessage: 'Error creating jobclass'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const jobclass = await Jobclass.findById(req.params.id)
    const characters = await Character.find({ character: jobclass.id }).limit(6).exec()
    res.render('jobclass/show', {
      character: character,
      charactersByJobclasses: jobclasses
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const Jobclass = await Jobclass.findById(req.params.id)
    res.render('jobclasses/edit', { jobclass: jobclass })
  } catch {
    res.redirect('/jobclasses')
  }
})

router.put('/:id', async (req, res) => {
  let jobclass
  try {
    jobclass = await Jobclass.findById(req.params.id)
    jobclass.name = req.body.jobclass
    await jobclass.save()
    res.redirect(`/jobclasses/${jobclass.id}`)
  } catch {
    if (jobclass == null) {
      res.redirect('/')
    } else {
      res.render('jobclasses/edit', {
        jobclass: jobclass,
        errorMessage: 'Error updating Jobclass'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let jobclass
  try {
    jobclass = await Jobclass.findById(req.params.id)
    await jobclass.remove()
    res.redirect('/jobclasses')
  } catch {
    if (jobclass == null) {
      res.redirect('/')
    } else {
      res.redirect(`/jobclasses/${jobclass.id}`)
    }
  }
})

module.exports = router