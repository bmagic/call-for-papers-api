const { JWT, JWK } = require('jose')

async function authorize (ctx, next) {
  if (ctx.headers.authorization) {
    const key = JWK.asKey(process.env.JWT_SECRET)

    const jwt = ctx.headers.authorization.split(' ')[1]
    try {
      const result = JWT.verify(
        jwt,
        key,
        { clockTolerance: '1 min' }
      )
      ctx.user = { id: result.id }
      return next()
    } catch (e) {
      ctx.throw(401, `JWT error : ${e.message}`)
    }
  }
  ctx.throw(401)
}

module.exports = {
  authorize,
}
