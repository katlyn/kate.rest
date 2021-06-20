const EventEmitter = require('events')
const fastify = require('fastify')({ logger: {
  stream: stream,
  redact: ['req.headers.authorization'],
  level: 'info',
  serializers: {
    req (req) {
      return {
        method: req.method,
        url: req.url,
        headers: req.headers,
        hostname: req.hostname,
        remoteAddress: req.ip,
        remotePort: req.connection.remotePort
      }
    }
  }
} })
const sanitize = require('sanitize-html')
const say = require('say')
const validateColor = require('validate-color').default

fastify.register(require('fastify-cors'), { 
  // put your options here
})

const state = {
  color: 'white',
  lastText: '',
  isSleeping: false
}

const emitter = new EventEmitter()
emitter.on('toggleSleep', () => {
  state.isSleeping = !state.isSleeping
  emitter.emit('sleepUpdate', state.isSleeping)
})

fastify.get('/', {
  schema: {
    response: {
      200: {
        type: 'string'
      }
    }
  }
}, (req, rep) => {
  return `Available routes:
GET /color
  Returns the current color being shown to kate.

POST /color
  Set the color that is being shown to kate. Requires a JSON body formatted as
  follows:
  
  {
    "color": "blue"
  }
  
  "color" is any valid css color.
  
GET /say
  Returns the last thing that was said to kate.

POST /say
  Say a string to kate with TTS. Requires a JSON body formatted as follows:
  
  {
    "text": "henlo kate"
  }
  
  "text" is any string.
  
GET /state
  Get the current state of kate, including sleeping status. Returns all above
  values as well.`
})

fastify.get('/color', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          color: { type: 'string' }
        }
      }
    }
  }
}, (req, rep) => {
  return {
    color: state.color
  }
})

fastify.post('/color', {
  schema: {
    body: {
      type: 'object',
      properties: { 
        color: { type: 'string' }
      },
      required: ['color']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}, (req, rep) => {
  const isValidColor = validateColor(req.body.color)
  if (isValidColor) {
    state.color = req.body.color
    emitter.emit('color', req.body.color)
    return { success: true }
  } else {
    rep.code(400)
    return {
      error: 'Not a valid CSS color.'
    }
  }
})

fastify.get('/say', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          text: { type: 'string' }
        }
      }
    }
  }
}, (req, rep) => {
  return {
    text: state.lastText
  }
})

fastify.post('/say', {
  schema: {
    body: {
      type: 'object',
      properties: { 
        text: { type: 'string' }
      },
      required: ['text']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          success: { type: 'boolean' }
        }
      }
    }
  }
}, (req, rep) => {
  emitter.emit('speech', sanitize(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'recursiveEscape'
  }))
  state.lastText = req.body.text
  say.speak(req.body.text)
  return { success: true }
})

fastify.get('/status', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          sleeping: { type: 'boolean' }
        }
      }
    }
  }
}, (req, rep) => {
  return {
    sleeping: state.isSleeping
  }
})

fastify.get('/state', {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          color: { type: 'string' },
          lastText: { type: 'string' },
          isSleeping: { type: 'boolean' }
        }
      }
    }
  }
}, (req, rep) => {
  return state
})

module.exports = emitter

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
