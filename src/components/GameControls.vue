<template>
  <div class="game-controls">
    <div class="score-buttons" v-if="!isFinished">
      <template v-for="index in 11 - currentRoll">
        <button
          :key="`btn-${index}`"
          class="btn"
          v-on:click="makeRoll(index - 1)"
        >
          {{ index - 1 }}
        </button>
      </template>
    </div>
    <div v-if="isFinished">
      <button class="btn" v-on:click="resetGame">Restart</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";

export default Vue.extend({
  computed: mapGetters(["game", "currentRoll", "isFinished"]),
  methods: {
    ...mapActions(["makeRoll", "resetGame"]),
  },
});
</script>

<style lang="scss">
.game-controls {
  margin-top: 10px;
}
.score-buttons {
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;

  > .btn {
    margin-right: 8px;
  }
}
.btn {
  $bg-color: #f3eedf;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 0 16px;
  border-radius: 4px;
  height: 36px;
  min-width: 44px;
  margin-right: 8px;

  will-change: box-shadow;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);

  text-decoration: none;
  background: $bg-color;
  border: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: none;
  box-sizing: border-box;
  vertical-align: middle;

  &:hover {
    background: darken($bg-color, 5%);
  }

  &:active {
    background: darken($bg-color, 10%);
    box-shadow: none;
  }
}
</style>
