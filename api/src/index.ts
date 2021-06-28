import 'source-map-support/register'

import fastifyCors from 'fastify-cors'
import fastifySocketio from 'fastify-socket.io'

import Fastify from 'fastify'
import routes from './routes'
import panelListener from './panelListener'

(async () => {
  const fastify = Fastify({ logger: true, trustProxy: true })
  await fastify.register(fastifyCors)
  await fastify.register(fastifySocketio)
  await fastify.register(routes)

  await panelListener.connect()
  await fastify.ready()
  await fastify.server.listen(3000, '0.0.0.0')
})().catch(err => { throw err })
