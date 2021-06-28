import fetch from 'node-fetch'
import Keyv from 'keyv'

import panelListener, { CanvasLayout, PanelAttributes } from './panelListener'

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

  if (await getPanelPower()) {
    await updatePanel()
  }
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

export const setPanelPower = async (power: boolean): Promise<void> => {
  await store.set('panels.power', power)
  if (power) {
    // Update the panels if we've turned them on.
    await updatePanel()
  }
}

export const getPanelPower = async (): Promise<boolean> => {
  return await store.get('panels.power')
}

export const getPanelAnimData = async (): Promise<string> => {
  const layout = await getPanelLayout()
  // animData format
  // [numPanels] [panel ID] [numFrames] [r] [g] [b] [w (unused)] [transition]
  let animData = layout.positionData.length.toString()
  for (const { panelId } of layout.positionData) {
    const color = await getPanelColor(panelId)
    if (color === undefined) {
      animData += ` ${panelId} 1 0 0 0 0 2`
      continue
    }
    const { r, g, b } = color
    animData += ` ${panelId} 1 ${r} ${g} ${b} 0 2`
  }
  return animData
}

export const updatePanel = async (): Promise<void> => {
  await fetch(`http://${process.env.NANOLEAF_IP}/api/v1/${process.env.NANOLEAF_KEY}/effects`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      write: {
        command: 'display',
        animType: 'custom',
        animData: await getPanelAnimData(),
        loop: true
      }
    })
  })
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

panelListener.on('state', async event => {
  if (event.attr === PanelAttributes.ON) {
    await setPanelPower(event.value as boolean)
  }
})
