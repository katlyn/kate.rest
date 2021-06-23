const emitter = require('./server')

emitter.on('color', color => {
  document.body.style.backgroundColor = color
})

emitter.on('sleepUpdate', isSleeping => {
  document.querySelector('#toggle-sleep').innerText = isSleeping ? 'Wake up' : 'Go to sleep'
})

emitter.on('speech', text => {
  document.querySelector('#tts-content').innerHTML = text
})

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#toggle-sleep').addEventListener('click', () => {
    emitter.emit('toggleSleep')
  })
})
