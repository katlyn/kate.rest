import 'source-map-support/register'
import fastify from './fastify'
import panelListener from './panelListener'
import { initStore } from './store'

(async () => {
  await fastify.setup()
  await panelListener.setup()
  await initStore()
  await fastify.server.listen(3000, '0.0.0.0')
})().catch(err => { throw err })
