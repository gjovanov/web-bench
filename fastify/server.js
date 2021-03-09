const fastify = require('fastify')({
  logger: false
})
fastify.server.headersTimeout = 0
fastify.server.keepAliveTimeout = 0

const port = 4002
fastify.get('/api/ping', async (request, reply) => {
  return 'pong'
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(port)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
