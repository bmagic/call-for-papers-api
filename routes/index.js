module.exports = (router) => {
  router.prefix('/v1')
  router.use('/auth/discord', require('./discord'))
  router.use('/user', require('./user'))
  router.use('/talks', require('./talks'))
}
