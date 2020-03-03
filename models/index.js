const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: { type: String, index: { unique: true } },
  username: { type: String },
  discordId: { type: Number, index: true },
  githubId: { type: Number, index: true },
  password: { type: String },
  salt: { type: String },
  roles: [{ type: String }]
})
const User = mongoose.model('User', userSchema)

const TalkSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId },
  name: { type: String }
})
const Talk = mongoose.model('Talk', TalkSchema)

module.exports = {
  User,
  Talk
}
