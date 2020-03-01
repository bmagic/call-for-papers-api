const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, index: { unique: true } }
})
const User = mongoose.model('User', userSchema)

const discordUserSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId, index: { unique: true } },
  discordId: { type: Number, index: { unique: true } }
})
const DiscordUser = mongoose.model('DiscordUser', discordUserSchema)

const discordTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId, index: { unique: true } },
  access_token: { type: String },
  expires_in: { type: Number },
  refresh_token: { type: String },
  scope: { type: String },
  token_type: { type: String }
})
const DiscordToken = mongoose.model('DiscordToken', discordTokenSchema)

const TalkSchema = new mongoose.Schema({
  userId: { type: mongoose.ObjectId },
  name: { type: String }
})
const Talk = mongoose.model('Talk', TalkSchema)

module.exports = {
  User,
  DiscordUser,
  DiscordToken,
  Talk
}
