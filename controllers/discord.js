const fetch = require('node-fetch')
const FormData = require('form-data')
const { JWT, JWK } = require('jose')

const { User, DiscordUser, DiscordToken } = require('../models')

async function auth (ctx) {
  const accessCode = ctx.request.query.code

  /** Get Oauth Tokens from Discord **/
  const data = new FormData()
  data.append('client_id', process.env.DISCORD_CLIENT_ID)
  data.append('client_secret', process.env.DISCORD_CLIENT_SECRET)
  data.append('grant_type', 'authorization_code')
  data.append('redirect_uri', process.env.DISCORD_REDIRECT_URI)
  data.append('scope', 'identify')
  data.append('code', accessCode)

  const oAuthTokenResponse = await fetch('https://discordapp.com/api/oauth2/token', {
    method: 'POST',
    body: data
  })

  if (oAuthTokenResponse.status !== 200) {
    ctx.throw(oAuthTokenResponse.status, `Discord return ${oAuthTokenResponse.statusText} on token request`)
  }
  const oAuthTokenJson = await oAuthTokenResponse.json()

  /** Get User from Discord **/
  const discordUserResponse = await fetch('https://discordapp.com/api/users/@me', {
    headers: {
      authorization: `${oAuthTokenJson.token_type} ${oAuthTokenJson.access_token}`
    }
  })
  const discordUserJson = await discordUserResponse.json()

  if (discordUserResponse.status !== 200) {
    ctx.throw(discordUserResponse.status, `Discord return ${discordUserResponse.statusText} on user request`)
  }

  if (discordUserJson.username === undefined || discordUserJson.id === undefined) {
    ctx.throw(400, 'Discord return an empty user')
  }

  /** Insert user in DB if new **/
  const discordUser = await DiscordUser.findOne({ discordId: discordUserJson.id })
  let userId
  if (discordUser === null) {
    const user = await new User({ username: discordUserJson.username }).save()
    await new DiscordUser({ discordId: discordUserJson.id, userId: user._id }).save()
    userId = user._id
  } else {
    userId = discordUser.userId
  }

  await DiscordToken.deleteMany({ userId: userId })
  await new DiscordToken({ userId: userId, access_token: oAuthTokenJson.access_token, expires_in: oAuthTokenJson.expires_in, refresh_token: oAuthTokenJson.refresh_token, scope: oAuthTokenJson.scope, token_type: oAuthTokenJson.token_type }).save()

  /** Generate JWT **/
  const key = JWK.asKey(process.env.JWT_SECRET)
  const token = JWT.sign({ id: userId }, key, {
    expiresIn: '24 hours',
    header: {
      typ: 'JWT'
    }
  })

  ctx.ok({ token: token })
}

module.exports = {
  auth
}
