const Router = require('koa-router')
const router = new Router()
const User = require('../controllers/user')
const Auth = require('../controllers/auth')

router.get('/', Auth.authorize, User.getUser)
router.post('/register', User.createUser)
router.post('/login', User.login)

module.exports = router.routes()
