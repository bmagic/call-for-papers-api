const Router = require('koa-router')
const router = new Router()
const User = require('../controllers/user')
const Auth = require('../controllers/auth')

router.post('/', User.createUser)

module.exports = router.routes()
