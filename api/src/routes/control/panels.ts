import { FastifyInstance } from 'fastify'
import { SocketStream } from 'fastify-websocket'
import { NotFound } from 'http-errors'

import panelListener from '../../panelListener'
import { getPanelColor, getPanelLayout, PanelColor, setPanelColor } from '../../store'

interface Params {
  panel: number
}

const sockets = new Set<SocketStream>()
const broadcast = (type: string, payload: any): void => {
  sockets.forEach(socket => {
    socket.socket.send(JSON.stringify({ type, d: payload }))
  })
}

panelListener.on('layout', layout => {
  broadcast('layoutUpdate', layout)
})

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get('/socket', { websocket: true }, async (connection, request) => {
    sockets.add(connection)
    const colors: Array<PanelColor & { panelId: number }> = []
    const layout = await getPanelLayout()
    for (const { panelId } of layout.positionData) {
      colors.push({
        ...await getPanelColor(panelId),
        panelId
      })
    }
    connection.socket.send(JSON.stringify({ type: 'colorUpdate', d: colors }))
    connection.socket.send(JSON.stringify({ type: 'layoutUpdate', d: layout }))

    const pingInterval = setInterval(() => connection.socket.ping(), 30e3)
    let pongTimeout = setTimeout(() => connection.socket.close(4001), 30e3 * 5)
    connection.socket.on('pong', () => {
      clearTimeout(pongTimeout)
      pongTimeout = setTimeout(() => connection.socket.close(4001), 30e3 * 5)
    })
    connection.socket.on('close', () => {
      clearInterval(pingInterval)
      sockets.delete(connection)
    })
    connection.socket.ping()
  })

  fastify.get<{ Params: Params }>('/color/:panel', {
    schema: {
      params: {
        type: 'object',
        panel: { type: 'number' }
      }
    }
  }, async (request, reply) => {
    const color = await getPanelColor(request.params.panel)
    if (color === undefined) {
      throw new NotFound('panel does not exist')
    }
    return color
  })

  fastify.post<{ Params: Params, Body: PanelColor }>('/color/:panel', {
    schema: {
      params: {
        type: 'object',
        panel: { type: 'number' }
      },
      body: {
        type: 'object',
        required: ['r', 'g', 'b'],
        properties: {
          r: { type: 'number', min: 0, max: 255 },
          g: { type: 'number', min: 0, max: 255 },
          b: { type: 'number', min: 0, max: 255 }
        }
      }
    }
  }, async (request, reply) => {
    const color = await getPanelColor(request.params.panel)
    if (color === undefined) {
      throw new NotFound('panel does not exist')
    }
    await setPanelColor(request.params.panel, request.body)
    broadcast('colorUpdate', [{
      ...request.body,
      panelId: request.params.panel
    }])

    void reply.code(204)
  })

  fastify.get('/layout', async (request, reply) => {
    return await getPanelLayout()
  })
}
