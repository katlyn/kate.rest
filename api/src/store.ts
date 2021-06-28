import Keyv from 'keyv'
import panelListener, { CanvasLayout } from './panelListener'

const store = new Keyv('sqlite://persist/store.sqlite')
export default store

export interface PanelColor {
  id?: number
  r: number
  g: number
  b: number
}

export const setPanelColor = async (panel: number, color: PanelColor): Promise<void> => {
  await store.set(`panels.color:${panel}`, {
    r: color.r,
    g: color.g,
    b: color.b
  })
}

export const getPanelColor = async (panel: number): Promise<PanelColor> => {
  return await store.get(`panels.color:${panel}`)
}

export const setPanelLayout = async (layout: CanvasLayout): Promise<void> => {
  await store.set('panels.layout', layout)
}

export const getPanelLayout = async (): Promise<CanvasLayout> => {
  return await store.get('panels.layout')
}

export const getPanelAnimData = async (): Promise<string> => {
  const layout = await getPanelLayout()
  // animData format
  // [numPanels] [panel ID] [numFrames] [r] [g] [b] [w (unused)] [transition]
  let animData = layout.positionData.length.toString()
  for (const { panelId } of layout.positionData) {
    const { r, g, b } = await getPanelColor(panelId)
    animData += ` ${panelId} 1 ${r} ${g} ${b} 0 2`
  }
  return animData
}

panelListener.on('layout', async layout => {
  if (typeof layout.value === 'number') return
  await setPanelLayout(layout.value)
  for (const panel of layout.value.positionData) {
    const panelExists = await getPanelColor(panel.panelId)
    if (panelExists === undefined) {
      await setPanelColor(panel.panelId, { r: 255, g: 255, b: 255 })
    }
  }
})
