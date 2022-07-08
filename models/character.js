const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
  characterName: {
    type: String,
    required: true
  },
  skills: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  characterImage: {
    type: Buffer,
    required: true
  },
  characterImageType: {
    type: String,
    required: true
  },
  jobclass: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Jobclass'
  },
  affiliation: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Affiliation'
  },
  rarity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Rarity'
  }

})

characterSchema.virtual('characterImagePath').get(function() {
  if (this.characterImage != null && this.characterImageType != null) {
    return `data:${this.characterImageType};charset=utf-8;base64,${this.characterImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Character', characterSchema)