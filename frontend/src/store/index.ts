import { Store } from './Store'
import socket, { isCustomEvent } from '@/socket'

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

socket.addEventListener('layoutUpdate', ev => {
  if (!isCustomEvent(ev)) return
  console.log(ev.detail)
  store.state.layout.numPanels = ev.detail.numPanels
  store.state.layout.sideLength = ev.detail.sideLength
  store.state.layout.positionData = ev.detail.positionData
})

socket.addEventListener('colorUpdate', ev => {
  if (!isCustomEvent(ev)) return
  console.log(ev.detail)
  for (const panel of ev.detail) {
    store.state.colors[panel.panelId] = panel
  }
})

export default store
