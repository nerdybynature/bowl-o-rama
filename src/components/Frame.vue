<template>
  <div
    class="frame"
    :class="{ strike: frame.isStrike(), 'last-frame': frame.isLastFrame }"
  >
    <div class="rolls">
      <template v-for="(roll, index) in frame.rolls">
        <span :key="roll.id">{{ getRollValue(frame, index) }}</span>
      </template>
      <template v-for="index in this.nbrOfEmptyRolls">
        <span :key="`${frame.id}-empty-roll-${index}`">&nbsp;</span>
      </template>
    </div>
    <div class="score">
      <h4>{{ frame.score }}</h4>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Frame as BowlingFrame } from "@/types/BowlingGame";

export default Vue.extend({
  props: {
    frame: {
      type: BowlingFrame,
      default: () => new BowlingFrame(),
    },
  },
  computed: {
    nbrOfEmptyRolls(): number {
      return this.frame.isLastFrame
        ? 3 - this.frame.rolls.length
        : 2 - this.frame.rolls.length;
    },
  },
  methods: {
    getRollValue(frame: BowlingFrame, index: number): string {
      const score = frame.rolls[index].score;
      if (score === 10 && index === 0) {
        return "X";
      } else if (frame.isSpare() && index === 1) {
        return "/";
      } else if (score === 0) {
        return "-";
      } else if (frame.isLastFrame && index > 0) {
        return score === 10 ? "X" : score.toString();
      } else {
        return score.toString();
      }
    },
  },
});
</script>
<style lang="scss">
@mixin roll-border {
  border-left: 1px solid var(--font-color);
  border-bottom: 1px solid var(--font-color);
}
.frame {
  font-family: "Indie Flower";
  font-size: 1.5em;
  border: 1px solid gray;
  flex-grow: 1;
  text-align: center;

  display: flex;
  flex-direction: column;
  height: 100px;
  width: 10%;

  justify-content: space-between;

  &.last-frame {
    flex-grow: 1.1;
  }

  &.strike:not(.last-frame) .rolls {
    flex-flow: row-reverse;

    span {
      &:last-of-type {
        border: none;
      }
      &:first-of-type {
        @include roll-border();
      }
    }
  }

  .rolls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    height: 50px;
    width: 100%;

    span {
      display: flex;
      flex-grow: 1;
      height: 100%;
      align-items: center;
      justify-content: center;
      width: 50%;
    }
    span:not(:first-of-type) {
      @include roll-border();
    }
  }

  .score {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    h4 {
      margin: 0;
    }
  }
}
</style>
