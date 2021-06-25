import { Store } from './Store'
import socket from '@/socket'

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
  colors: { [key: number]: PanelColor },
  selected: number|null
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
  colors: {},
  selected: null
}

const store = new Store(state)

export const getColor = (panel: number): PanelColor | undefined => {
  return store.state.colors[panel]
}

export const setSelected = (panel: number): void => {
  store.state.selected = panel
}

socket.on('layoutUpdate', layout => {
  console.log(layout)
  if (layout.attr === 1) {
    store.state.wall.layout = layout.value
  }
})

socket.on('colorUpdate', (panels: State['colors']) => {
  console.log(panels)
  for (const panel in panels) {
    store.state.colors[panel] = panels[panel]
  }
})

export default store
