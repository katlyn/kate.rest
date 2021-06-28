import { io } from 'socket.io-client'

const socket = io('http://192.168.9.248:3000', { path: '/panels/socket' })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.socket = socket

export default socket
