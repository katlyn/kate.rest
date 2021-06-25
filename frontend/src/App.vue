<template>
  <Wall/>
  <Picker/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Picker from './components/Picker.vue'
import Wall from './components/Wall.vue'

export default defineComponent({
  name: 'App',
  components: {
    Wall,
    Picker
  }
})
</script>

<style lang="scss">
:root {
  --background-primary: #1E1F29;
  --background-secondary: #2f3040;
  --background-secondary-alt: #2f3040;
  --background-tertiary: #37394b;
  --background-accent: #474a62;
  --background-selected: #676b8e;
}

* {
  margin: 0;
  padding: 0;
}

body {
  background-color: #1E1F29;
  color: #eee;
}

#app {
  display: grid;
  grid-template-columns: 1fr 1fr;

  > .wall {
    max-height: calc(100vh - 2em);
  }
}
</style>
