import { EventEmitter } from 'events'
import fetch from 'node-fetch'
import { Writable } from 'stream'

import { fastify } from './fastify'

export enum PanelEvents {
  STATE = 1,
  LAYOUT,
  EFFECTS,
  TOUCH
}

export enum PanelState {
  ON = 1,
  BRIGHTNESS,
  HUE,
  SATURATION,
  CCT,
  COLOR_MODE
}

export enum PanelLayout {
  LAYOUT = 1,
  GLOBAL_ORIENTATION
}

export enum PanelTouch {
  SINGLE_TAP = 0,
  DOUBLE_TAP,
  SWIPE_UP,
  SWIPE_DOWN,
  SWIPE_LEFT,
  SWIPE_RIGHT
}

class PanelEventStream extends Writable {
  _write (chunk: Buffer, enc: string, next: (err?: Error) => void): void {
    const payload = chunk.toString().trim()
    const lines = payload.split('\n')
    const eventType = Number(lines[0].substr(lines[0].indexOf(' ') + 1))
    const { events } = JSON.parse(lines[1].substr(lines[1].indexOf(' ') + 1))

    console.log(PanelEvents[eventType])

    for (const event of events) {
      this.emit(PanelEvents[eventType], event)
    }

    if (eventType === PanelEvents.LAYOUT) {
      fastify.io.emit('layoutUpdate', events[0])
    }

    next()
  }
}

class PanelListener extends EventEmitter {
  constructor () {
    super()
    this._connect().catch(err => { throw err })
  }

  async _connect () {

  }
}

export const setup = async (): Promise<void> => {
  const res = await fetch('http://192.168.9.24:16021/api/v1/key/events?id=1,2,4')
  if (res.ok) {
    res.body.pipe(panelEventStream)
    res.body.on('end', () => {
      throw new Error('Disconnected from Nanoleaf event socket')
    })
  } else {
    throw new Error('Unable to connect to Nanoleaf event socket')
  }
}

const panelEventStream = new PanelEventStream()

export default {
  panelEventStream,
  setup
}
