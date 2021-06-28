import { TypedEmitter } from 'tiny-typed-emitter'
import fetch from 'node-fetch'
import { Writable } from 'stream'

export enum PanelEventTypes {
  STATE = 1,
  LAYOUT,
  EFFECTS,
  TOUCH
}

export enum PanelAttributes {
  ON = 1,
  BRIGHTNESS,
  HUE,
  SATURATION,
  CCT,
  COLOR_MODE
}

export interface PanelStateEvent {
  attr: PanelAttributes
  value: number
}

export enum PanelLayout {
  LAYOUT = 1,
  GLOBAL_ORIENTATION
}

export interface PanelPosition {
  panelId: number
  x: number
  y: number
  o: number
  shapeType: number
}

export interface CanvasLayout {
  numPanels: number
  sideLength: number
  positionData: PanelPosition[]
}

export interface PanelLayoutEvent {
  attr: PanelLayout
  value: number | CanvasLayout
}

export enum PanelGesture {
  SINGLE_TAP = 0,
  DOUBLE_TAP,
  SWIPE_UP,
  SWIPE_DOWN,
  SWIPE_LEFT,
  SWIPE_RIGHT
}

export interface PanelTouchEvent {
  gesture: PanelGesture
  panelId: number
}

class PanelEventStream extends Writable {
  _panelListener: PanelListener
  constructor (panelListener: PanelListener) {
    super()
    this._panelListener = panelListener
  }

  _write (chunk: Buffer, enc: string, next: (err?: Error) => void): void {
    const payload = chunk.toString().trim()
    const lines = payload.split('\n')
    const eventType = Number(lines[0].substr(lines[0].indexOf(' ') + 1))
    const events: Array<PanelStateEvent|PanelTouchEvent|PanelLayoutEvent> = JSON.parse(lines[1].substr(lines[1].indexOf(' ') + 1)).events

    for (const event of events) {
      this._panelListener.emit(PanelEventTypes[eventType].toLowerCase() as keyof PanelEvents, event)
      console.log(PanelEventTypes[eventType].toLowerCase(), event)
    }

    next()
  }
}

interface PanelEvents {
  'connected': () => void
  'disconnected': () => void
  'error': (err: any) => void
  'state': (event: PanelStateEvent) => void
  'layout': (event: PanelLayoutEvent) => void
  'touch': (event: PanelTouchEvent) => void
}

class PanelListener extends TypedEmitter<PanelEvents> {
  private readonly _host: string
  private readonly _token: string

  constructor (host: string, token: string) {
    super()
    this._host = host
    this._token = token
  }

  async connect (): Promise<void> {
    // Fetch state to populate initial values
    const stateRes = await fetch(`http://${this._host}/api/v1/${this._token}/`)
    console.log(stateRes.ok, stateRes.status, stateRes.statusText)
    const data = await stateRes.json()
    this.emit('layout', { attr: 1, value: data.panelLayout.layout })

    // Connect to the socket to listen to events
    const res = await fetch(`http://${this._host}/api/v1/${this._token}/events?id=1,2,4`)
    this.emit('connected')
    if (res.ok) {
      res.body.pipe(new PanelEventStream(this))
      res.body.on('end', () => {
        this.emit('disconnected')
      })
    } else {
      this.emit('error', res)
    }
  }
}

const panelListener = new PanelListener(process.env.NANOLEAF_IP, process.env.NANOLEAF_KEY)

export default panelListener
