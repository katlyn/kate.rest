import 'source-map-support/register'

import Fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import fastifyRateLimit from 'fastify-rate-limit'
import fastifyStatic from 'fastify-static'
import { join } from 'path'

import routes from './routes'
import panelListener from './panelListener'

(async () => {
  const fastify = Fastify({
    logger: {
      serializers: {
        req (request) {
          return {
            reqId: request.id,
            req: {
              method: request.method,
              url: request.url,
              hostname: request.hostname,
              remoteAddress: request.headers['CF-Connecting-IP'] as string ?? request.ip,
              remotePort: request.socket.remotePort
            }
          }
        }
      }
    }
  })
  await fastify.register(fastifyCors)
  await fastify.register(fastifyRateLimit, {
    max: 60,
    timeWindow: '1 minute',
    keyGenerator (req) { return req.headers['CF-Connecting-IP'] as string ?? req.ip }
  })
  await fastify.register(fastifyStatic, {
    root: join(__dirname, '..', 'frontend'),
    prefix: '/gui'
  })
  await fastify.register(routes)

  await panelListener.connect()
  await fastify.ready()
  await fastify.server.listen(80, '0.0.0.0')
})().catch(err => { throw err })
