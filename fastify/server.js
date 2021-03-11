const { sso } = require('node-expose-sspi')
const fastify = require('fastify')({
  logger: false
})
fastify.server.headersTimeout = 0
fastify.server.keepAliveTimeout = 0

const port = 4002

// Run the server!
const start = async () => {
  try {
    await fastify.register(require('middie'))
    fastify.use(sso.auth({ useGroups: false }))
    fastify.get('/api/ping', async (request, reply) => {
      return 'pong'
    })
    fastify.get('/api/auth', (request, reply) => {
      reply.send(request.raw.sso.user)
    })
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
