const { User } = require('../models')

async function getUser (ctx) {
  const user = await User.findOne({ _id: ctx.user.id })
  ctx.ok(user)
}

module.exports = {
  getUser
}
