import { InternalServerError } from 'http-errors'
import fetch from 'node-fetch'
import fastify from './fastify'

export interface PanelPosition {
  panelId: number
  x: number
  y: number
  o: number
  shapeType: number
}

export interface CanvasLayout {
  globalOrientation: {
    value: number
    max: number
    min: number
  }

  layout: {
    numPanels: number
    sideLength: number
    positionData: PanelPosition[]
  }
}

export interface PanelColor {
  id: number
  r: number
  g: number
  b: number
}

interface State {
  wall: CanvasLayout
  colors: { [key: number]: PanelColor }
}

const state: State = {
  wall: {
    globalOrientation: { value: 90, max: 360, min: 0 },
    layout: {
      numPanels: 0,
      sideLength: 100,
      positionData: []
    }
  },
  colors: {}
}

export const initStore = async (): Promise<void> => {
  const res = await fetch('http://192.168.9.24:16021/api/v1/key/')
    .then(async req => await req.json())

  state.wall = res.panelLayout

  await fetch('http://192.168.9.24:16021/api/v1/key/state', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hue: {
        value: 0
      },
      sat: {
        value: 0
      },
      brightness: {
        value: 0
      }
    })
  })

  for (const panel of state.wall.layout.positionData) {
    state.colors[panel.panelId] = {
      id: panel.panelId,
      r: 0,
      g: 0,
      b: 0
    }
  }
}

export const buildAnimData = (): string => {
  // animData format
  // [numPanels] [panel ID] [numFrames] [r] [g] [b] [w (unused)] [transition]
  let animData = Object.keys(state.colors).length.toString()
  for (const panel in state.colors) {
    const { r, g, b } = state.colors[panel]
    animData += ` ${panel} 1 ${r} ${g} ${b} 0 2`
  }
  console.log(animData)
  return animData
}

export const setColor = async (color: PanelColor): Promise<void> => {
  state.colors[color.id] = color
  const req = await fetch('http://192.168.9.24:16021/api/v1/key/effects', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      write: {
        command: 'display',
        animType: 'custom',
        animData: buildAnimData(),
        loop: true
      }
    })
  })
  if (!req.ok) {
    console.error(req.status, await req.text())
    throw new InternalServerError('unable to contact panel')
  }
  fastify.server.io.emit('colorUpdate', state.colors)
}

export default state
