const mongoose = require('mongoose')
const Character = require('./character')

const Jobclass = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
})

Jobclass.pre('remove', function(next) {
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

module.exports = mongoose.model('Jobclass', Jobclass)