let socketUri: string
if (location.protocol === 'https:') {
  socketUri = 'wss:'
} else {
  socketUri = 'ws:'
}
socketUri += '//' + location.host + '/control/panels/socket'

const socket = new WebSocket(socketUri)

class SocketEmitter extends EventTarget {
  constructor () {
    super()
    socket.addEventListener('message', this._handleMessage.bind(this))
  }

  _handleMessage (ev: MessageEvent) {
    const payload = JSON.parse(ev.data)
    this.dispatchEvent(new CustomEvent(payload.type, { detail: payload.d }))
  }
}

export const isCustomEvent = (ev: Event): ev is CustomEvent => {
  return 'detail' in ev
}

export default new SocketEmitter()
