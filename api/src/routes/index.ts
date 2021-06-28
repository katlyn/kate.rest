import type { FastifyInstance } from 'fastify'
import color from './panels'

export default async function (fastify: FastifyInstance): Promise<void> {
  await fastify.register(color, { prefix: '/panels' })
}
