import { FastifyInstance } from 'fastify'
import socketioServer from 'fastify-socket.io'
import { NotFound } from 'http-errors'
import fetch from 'node-fetch'
import panelListener from '../panelListener'
import { getPanelAnimData, getPanelColor, getPanelLayout, PanelColor, setPanelColor } from '../store'

interface Params {
  panel: number
}

export default async function (fastify: FastifyInstance): Promise<void> {
  await fastify.register(socketioServer, {
    path: '/panels/socket',
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
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
    await fetch(`http://${process.env.NANOLEAF_IP}/api/v1/${process.env.NANOLEAF_KEY}/effects`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        write: {
          command: 'display',
          animType: 'custom',
          animData: await getPanelAnimData(),
          loop: true
        }
      })
    })
    fastify.io.emit('colorUpdate', [{
      ...request.body,
      panelId: request.params.panel
    }])

    void reply.code(204)
  })

  fastify.get('/layout', async (request, reply) => {
    return await getPanelLayout()
  })

  fastify.ready(() => {
    fastify.io.on('connect', async socket => {
      const colors: Array<PanelColor & { panelId: number }> = []

      const layout = await getPanelLayout()
      for (const { panelId } of layout.positionData) {
        colors.push({
          ...await getPanelColor(panelId),
          panelId
        })
      }
      socket.emit('colorUpdate', colors)
      socket.emit('layoutUpdate', layout)
    })

    panelListener.on('layout', layout => {
      fastify.io.emit('layoutUpdate', layout)
    })
  })
}
