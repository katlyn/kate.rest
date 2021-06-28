import type { FastifyInstance } from 'fastify'
import kate from './kate'

import color from './control/panels'

export default async function (fastify: FastifyInstance): Promise<void> {
  await fastify.register(color, { prefix: '/control/panels' })
  await fastify.register(color, { prefix: '/panels' })
  await fastify.register(kate, { prefix: '/state' })

  fastify.get('/', async (request, reply) => {
    return `--- kate.rest ---

ROUTES
  GET /state
    Return basic state information on kate. Currently only returns sleep
    status.

  CONTROL
    GET /control/panels/color/<panel-id>
      Get the color of the requested panel. Returns a Color object.

    POST /control/panels/color/<panel-id>
      Set the color of the requested panel. Returns 204 - no content on success.

    GET /control/panels/layout
      Returns the current layout of the panels. This can be used to reconstruct
      a visual of the panels, as well as be used to aquire a list of all panel
      ids. Returns a Layout object.

    WEBSOCKET /control/panels/socket
      You are able to connect to this path with a websocket client to recieve
      color and layout updates in realtime. Events emitted are \`layoutUpdate\`
      and \`colorUpdate\`.


DEFINITIONS
  Color
    JSON object in the following format.
      {
        "r": 255,
        "g": 255,
        "b": 255
      }
  
  Layout
    JSON object in the following format.
      {
        "numPanels": 9,
        "sideLength": 100,
        "positionData": [
          {
            "panelId": 2322,
            "x": 250,
            "y": 100,
            "o": 0,
            "shapeType": 3
          },
          ...
        ]
      }


NOTES
  PANEL GUI
    If you don't want to use the API, you can control the panels with a more
    user-friendly interface at https://kate.rest/gui/. Note that this client
    does not properly respect rate limits, rapid changes and errors will not be
    handled properly.

  RATELIMITING
    Most routes are ratelimited. Headers will be returned with information on
    the current ratelimit state. See below table for more information.
    
    | Header                 | Description                                     |
    |------------------------|-------------------------------------------------|
    |\`x-ratelimit-limit\`     | how many requests the client can make           |
    |\`x-ratelimit-remaining\` | how many requests remain to the client in the   |
    |                        |   timewindow                                    |
    |\`x-ratelimit-reset\`     | how many seconds must pass before the rate limit|
    |                        |   resets                                        |
    |\`retry-after\`           | if the max has been reached, the milliseconds   |
    |                        |   the client must wait before they can make new |
    |                        |   requests                                      |

  SLEEP STATUS
    The sleep status of kate is maintained by the power state of the
    API-controlled light panel. If the panel is off, kate is shown as sleeping.
    As a note, any color changes done to the panel will be saved into state and
    updated when the panel is turned on again.
`
  })
}
