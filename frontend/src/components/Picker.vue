<template>
  <div v-if="selected">
    Panel {{ selected }} selected
    <input type="color" :value="color" @change="input">
  </div>
  <div v-else>No panel selected</div>
</template>

<script lang="ts">
import store, { getColor } from '@/store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Picker',
  computed: {
    selected () {
      return store.state.selected
    },
    color () {
      const color = getColor(store.state.selected as number)
      if (color === undefined) {
        return '#000'
      }
      const { r, g, b } = color
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
    }
  },
  methods: {
    input (ev: InputEvent) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec((ev.target as HTMLInputElement).value) as RegExpExecArray
      const color = {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
      fetch(`http://192.168.9.248:3000/v1/color/${store.state.selected}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(color)
      })
    }
  }
})
</script>

<style lang="scss">
</style>
