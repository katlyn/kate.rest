import type { FastifyInstance } from 'fastify'
import color from './color'

export default async function (fastify: FastifyInstance): Promise<void> {
  await fastify.register(color)
}
