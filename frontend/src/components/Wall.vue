<template>
  <svg
    class="wall"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    :viewBox="`2 2 ${canvasSize.x} ${canvasSize.y}`"
    xml:space="preserve"
  >
    <Panel
      v-for="panel of layout.positionData"
      :key="panel.panelId"
      :panel="panel"
      :sideLength="layout.sideLength"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Panel from './Panel.vue'

import state, { CanvasLayout } from '@/store'

export default defineComponent({
  name: 'Wall',
  components: {
    Panel
  },
  data () {
    return {
      rawLayout: state.state.layout
    }
  },
  computed: {
    canvasSize (): { x: number, y: number } {
      const x = Math.max(...this.layout.positionData.map(d => d.x), 0) + this.layout.sideLength
      const y = Math.max(...this.layout.positionData.map(d => d.y), 0) + this.layout.sideLength

      console.log(x, y)

      return { x, y }
    },
    layout (): CanvasLayout {
      return {
        numPanels: this.rawLayout.numPanels,
        sideLength: this.rawLayout.sideLength,
        positionData: this.rawLayout.positionData.map(d => ({
          panelId: d.panelId,
          shapeType: d.shapeType,
          x: d.y,
          y: d.x,
          o: d.o
        }))
      }
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.wall {
  margin: 1em;
}
</style>
