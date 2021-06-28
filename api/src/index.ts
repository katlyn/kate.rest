import 'source-map-support/register'

import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyStatic from 'fastify-static'
import fastifyWebsocket from 'fastify-websocket'
import { join } from 'path'

import routes from './routes'
import panelListener from './panelListener'

(async () => {
  const fastify = Fastify({
    logger: {
      serializers: {
        req (request) {
          return {
            method: request.method,
            url: request.url,
            hostname: request.hostname,
            remoteAddress: request.headers['cf-connecting-ip'] as string ?? request.ip,
            remotePort: request.socket.remotePort
          }
        }
      }
    }
  })
  await fastify.register(fastifyCors)
  await fastify.register(fastifyRateLimit, {
    max: 60,
    timeWindow: '1 minute',
    keyGenerator (req) { return req.headers['cf-connecting-ip'] as string ?? req.ip }
  })
  await fastify.register(fastifyWebsocket)
  await fastify.register(fastifyStatic, {
    root: join(__dirname, '..', 'frontend'),
    prefix: '/gui'
  })
  await fastify.register(routes)

  await panelListener.connect()
  await fastify.ready()
  await fastify.server.listen(80, '0.0.0.0')
})().catch(err => { throw err })
