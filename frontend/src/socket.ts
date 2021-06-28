import { io } from 'socket.io-client'

const socket = io({ path: '/panels/socket' })

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.socket = socket

export default socket
