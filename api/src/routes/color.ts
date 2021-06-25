import { FastifyInstance } from 'fastify'
import { NotFound } from 'http-errors'

import state, { PanelColor, setColor } from '../store'

interface Params {
  panel: number
}

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.get<{ Params: Params }>('/color/:panel', {
    schema: {
      params: {
        type: 'object',
        panel: { type: 'number' }
      }
    }
  }, async (request, reply) => {
    const color = state.colors[request.params.panel]
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
    const color = state.colors[request.params.panel]
    if (color === undefined) {
      throw new NotFound('panel does not exist')
    }
    await setColor({
      id: color.id,
      ...request.body
    })

    return {
      status: 'ok'
    }
  })
}
