const Router = require('koa-router')
const router = new Router()
const Talks = require('../controllers/talks')
const Auth = require('./auth')

router.get('/', Auth.authorize, Talks.getTalks)
router.post('/', Auth.authorize, Talks.addTalk)
router.del('/:id', Auth.authorize, Talks.deleteTalk)

module.exports = router.routes()
