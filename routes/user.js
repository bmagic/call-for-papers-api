const Router = require('koa-router')
const router = new Router()
const User = require('../controllers/user')
const Auth = require('./auth')

router.get('/', Auth.authorize, User.getUser)

module.exports = router.routes()
