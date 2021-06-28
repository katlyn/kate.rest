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
  numPanels: number
  sideLength: number
  positionData: PanelPosition[]
}

export interface PanelColor {
  panelId: number
  r: number
  g: number
  b: number
}

interface State {
  layout: CanvasLayout
  colors: { [key: number]: PanelColor },
  selected: number|null
}

const state: State = {
  layout: {
    numPanels: 0,
    sideLength: 100,
    positionData: []
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

socket.on('layoutUpdate', (layout: CanvasLayout) => {
  console.log(layout)
  store.state.layout.numPanels = layout.numPanels
  store.state.layout.sideLength = layout.sideLength
  store.state.layout.positionData = layout.positionData
})

socket.on('colorUpdate', (panels: PanelColor[]) => {
  console.log(panels)
  for (const panel of panels) {
    store.state.colors[panel.panelId] = panel
  }
})

export default store
