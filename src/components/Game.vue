<template>
  <div class="game">
    <div class="scoreboard">
      <div class="frames">
        <template v-for="(frame, index) in game.frames">
          <Frame :key="frame.id" :frame="game.frames[index]" />
        </template>
        <template v-for="index in 10 - game.frames.length">
          <div
            :key="index - 1"
            class="frame"
            :class="{ 'last-frame': index === 10 - game.frames.length }"
          >
            <div class="rolls">
              <span></span>
              <span></span>
              <span v-if="index === 10 - game.frames.length"></span>
            </div>
            <div></div>
          </div>
        </template>
        <div class="frame">
          <h3>{{ totalScore }}</h3>
        </div>
      </div>
    </div>
    <GameControls />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";
import Frame from "./Frame.vue";
import GameControls from "./GameControls.vue";

export default Vue.extend({
  components: { Frame, GameControls },
  computed: mapGetters(["game", "isFinished", "totalScore"]),
  methods: {
    roll(pins: number): void {
      this.game.roll(pins);
    },
  },
});
</script>
<style lang="scss" scoped>
.game {
  padding: 20px 0;
}

.scoreboard {
  display: flex;
  flex-direction: row;
}
.frames {
  display: flex;
  flex-grow: 1;
}
.score {
  margin: auto 0 auto auto;
}
</style>
