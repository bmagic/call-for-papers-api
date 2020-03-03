const { Talk } = require('../models')

async function getTalks (ctx) {
  const talks = await Talk.find().sort('name')
  ctx.ok(talks)
}

module.exports = {
  getTalks
}
