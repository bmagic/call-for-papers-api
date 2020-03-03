const Router = require('koa-router')
const router = new Router()
const Talks = require('../controllers/talks')
const Auth = require('../controllers/auth')

router.get('/', (ctx, next) => Auth.authenticate(ctx, next, 'moderator'), Talks.getTalks)

module.exports = router.routes()
