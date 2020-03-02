const { User } = require('../models')
const crypto = require('crypto')
const { JWT, JWK } = require('jose')

async function getUser (ctx) {
  const user = await User.findOne({ _id: ctx.user.id })
  ctx.ok(user)
}

async function createUser (ctx) {
  if (ctx.request.body && ctx.request.body.email && ctx.request.body.password) {
    let user = User.findOne({ email: ctx.request.body.email })
    if (user !== null) {
      ctx.throw(409)
    }
    const salt = crypto.randomBytes(16).toString('hex')
    const password = crypto.pbkdf2Sync(ctx.request.body.password, salt, 1000, 64, 'sha512').toString('hex')

    user = await new User({ email: ctx.request.body.email, password: password, salt: salt }).save()

    const key = JWK.asKey(process.env.JWT_SECRET)
    const token = JWT.sign({ id: user._id }, key, {
      expiresIn: '24 hours',
      header: {
        typ: 'JWT'
      }
    })

    ctx.ok({ token: token })
  } else {
    ctx.throw(400)
  }
}
async function login (ctx) {
  if (ctx.request.body && ctx.request.body.email && ctx.request.body.password) {
    const user = User.findOne({ email: ctx.request.body.email })

    const password = crypto.pbkdf2Sync(ctx.request.body.password, user.salt, 1000, 64, 'sha512').toString('hex')

    if (user.password !== password) {
      ctx.throw(403)
    }

    const key = JWK.asKey(process.env.JWT_SECRET)
    const token = JWT.sign({ id: user._id }, key, {
      expiresIn: '24 hours',
      header: {
        typ: 'JWT'
      }
    })

    ctx.ok({ token: token })
  } else {
    ctx.throw(400)
  }
}

module.exports = {
  getUser,
  createUser,
  login
}
