<<<<<<< HEAD
const { sso } = require('node-expose-sspi')
=======
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356
const fastify = require('fastify')({
  logger: false
})
fastify.server.headersTimeout = 0
fastify.server.keepAliveTimeout = 0

const port = 4002
<<<<<<< HEAD
=======
fastify.get('/api/ping', async (request, reply) => {
  return 'pong'
})
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356

// Run the server!
const start = async () => {
  try {
<<<<<<< HEAD
    await fastify.register(require('middie'))
    fastify.use(sso.auth({ useGroups: false }))
    fastify.get('/api/ping', async (request, reply) => {
      return 'pong'
    })
    fastify.get('/api/auth', (request, reply) => {
      reply.send(request.raw.sso.user)
    })
=======
>>>>>>> 5690ea7847285aa3954bc9708258d3caba81d356
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
