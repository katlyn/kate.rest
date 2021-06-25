import { Server, IncomingMessage, ServerResponse } from 'http'
import Fastify, { FastifyInstance } from 'fastify'
import fastifyCors from 'fastify-cors'
import socketioServer from 'fastify-socket.io'
import { Socket } from 'socket.io'
import state from './store'
import v1 from './routes/v1'

export const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({ logger: true, trustProxy: true })

export const setup = async (): Promise<void> => {
  await fastify.register(fastifyCors)
  await fastify.register(socketioServer, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  })

  await fastify.register(v1, { prefix: '/v1' })

  fastify.ready(err => {
    if (err) {
      throw err
    }

    fastify.io.on('connect', (socket: Socket) => {
      console.log(`Client ${socket.id} connected!`)
      socket.emit('layoutUpdate', { attr: 1, value: state.wall.layout })
      socket.emit('colorUpdate', state.colors)
    })
  })
}

export default {
  setup,
  server: fastify
}
