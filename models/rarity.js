const mongoose = require('mongoose')
const Character = require('./character')

const Rarity = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
})

Rarity.pre('remove', function(next) {
  Character.find({ name: this.id }, (err, characters) => {
    if (err) {
      next(err)
    } else if (characters.length > 0) {
      next(new Error('This author has books still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Rarity', Rarity)