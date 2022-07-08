const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Jobclass = require('../models/jobclass')
const Rarity = require('../models/rarity')
const Affiliation = require('../models/Affiliation')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Characters Route
router.get('/', async (req, res) => {
  let query = Character.find()
  if (req.query.characterName != null && req.query.title != '') {
    query = query.regex('characterName ', new RegExp(req.query.characterName, 'i'))
  }
  if (req.query.class != null && req.query.class != '') {
    query = query.regex('jobclass', new RegExp(req.query.jobclass, 'i'))
  }
  if (req.query.affiliation != null && req.query.affiliation != '') {
    query = query.regex('affiliation', new RegExp(req.query.affiliation, 'i'))
  }
  if (req.query.rarity != null && req.query.rarity != '') {
    query = query.regex('rarity', new RegExp(req.query.rarity, 'i'))
  }
  
  try {
    const characters = await query.exec()
    res.render('characters/index', {
        characters: characters,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Character Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Character())
})

// Create Character Route
router.post('/', async (req, res) => {
  const character = new Character({
    characterName: req.body.characterName,
    jobclass: req.body.jobclass,
    affiliation: req.body.affiliation,
    rarity: req.body.rarity,
    skills: req.body.skills
  })
  saveCover(character, req.body.cover)

  try {
    const newCharacter = await character.save()
    res.redirect(`characters/${character.id}`)
  } catch {
    renderNewPage(res, character, true)
  }
})

// Show Character Route
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
                           .populate('character')
                           .exec()
    res.render('characters/show', { character: character })
  } catch {
    res.redirect('/')
  }
})

// Edit Character Route
router.get('/:id/edit', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id)
    renderEditPage(res, character)
  } catch {
    res.redirect('/')
  }
})

// Update Character Route
router.put('/:id', async (req, res) => {
  let character

  try {
    character = await Character.findById(req.params.id)
    character.characterName = req.body.characterName
    character.jobclass = req.body.jobclass
    character.affiliation = req.body.affiliation
    character.rarity = req.body.rarity
    character.skills = req.body.skill
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(character, req.body.cover)
    }
    await character.save()
    res.redirect(`/characters/${character.id}`)
  } catch {
    if (character != null) {
      renderEditPage(res, character, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Character Page
router.delete('/:id', async (req, res) => {
  let character
  try {
    character = await Character.findById(req.params.id)
    await character.remove()
    res.redirect('/characters')
  } catch {
    if (character != null) {
      res.render('characters/show', {
        character: character,
        errorMessage: 'Could not remove character'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, character, hasError = false) {
  renderFormPage(res, character, 'new', hasError)
}

async function renderEditPage(res, character, hasError = false) {
  renderFormPage(res, character, 'edit', hasError)
}

async function renderFormPage(res, character, form, hasError = false) {
  try {
    const characters = await Character.find({})
    const params = {
      characterName: characterName,
      skills: skills,
      affiliation: affiliation,
      rarity: rarity,
      jobclass: jobclass
   }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Character'
      } else {
        params.errorMessage = 'Error Creating Character'
      }
    }
    res.render(`characters/${form}`, params)
  } catch {
    res.redirect('/characters')
  }
}

function saveCover(character, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    character.coverImage = new Buffer.from(cover.data, 'base64')
    character.coverImageType = cover.type
  }
}

module.exports = router