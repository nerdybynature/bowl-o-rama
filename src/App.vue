<template>
  <div id="app">
    <h1>Bowl-O-Rama</h1>
    <Game />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Game from "./components/Game.vue";

export default Vue.extend({
  name: "App",
  components: {
    Game,
  },
});
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap");
:root {
  --bg-paper: #f0ead6;
  --font-color: #2c3e50;
}
#app {
  padding: 20px;
  font-family: "Courier New", monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--font-color);
  margin: 60px auto 0;
  background: var(--bg-paper);

  width: 50vw;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12), inset 5px 5px 0px var(--bg-paper),
    inset -5px -5px 0px -1px var(--bg-paper),
    inset 6px 6px 0px var(--font-color),
    inset -6px -6px 0px -1px var(--font-color);

  > h1 {
    margin: 0;
    font-size: 1.5em;
  }
}
</style>
