import { FastifyInstance } from 'fastify/types/instance'
import { getPanelPower } from '../store'

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async (request, reply) => {
    return {
      sleeping: !await getPanelPower()
    }
  })
}
