<template>
  <svg
    class="panel"
    :x="panel.x"
    :y="panel.y"
    @click="select"
  >
      <rect
        x="2"
        y="2"
        rx="4"
        :width="sideLength - 2"
        :height="sideLength - 2"
        :fill="selected ? 'var(--background-selected)' : 'var(--background-tertiary)'"
      />
      <rect
        x="5"
        y="5"
        rx="2"
        :width="sideLength - 8"
        :height="sideLength - 8"
        :fill="color"
      />
  </svg>
</template>

<script lang="ts">
import store, { getColor, PanelPosition, setSelected } from '@/store'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Panel',
  props: {
    panel: {
      type: Object as PropType<PanelPosition>,
      required: true
    },
    sideLength: Number
  },
  computed: {
    color (): string {
      const c = getColor(this.panel.panelId)
      if (c === undefined) {
        return 'rgb(0, 0, 0)'
      }
      return `rgb(${c.r}, ${c.g}, ${c.b})`
    },
    selected (): boolean {
      return store.state.selected === this.panel.panelId
    }
  },
  methods: {
    select () {
      setSelected(this.panel.panelId)
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.panel {
  cursor: pointer;

  rect {
    transition: fill ease 0.2s;
  }
}
</style>
