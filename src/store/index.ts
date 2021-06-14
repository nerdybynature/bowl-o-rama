import Vue from "vue";
import Vuex from "vuex";
import { BowlingGame } from "@/types/BowlingGame";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    game: new BowlingGame() as BowlingGame,
    currentRoll: 0 as number,
  },
  mutations: {
    makeRoll(state, pins: number) {
      state.game.roll(pins);
      if (
        state.game.currentFrame === null ||
        (pins === 10 && state.game.currentFrame.rolls.length <= 2) ||
        state.game.currentFrame.isSpare()
      ) {
        state.currentRoll = 0;
      } else {
        state.currentRoll = pins;
      }
    },
    resetGame(state) {
      state.game = new BowlingGame();
      state.currentRoll = 0;
    },
  },
  actions: {
    makeRoll({ commit }, pins: number) {
      commit("makeRoll", pins);
    },
    resetGame({ commit }) {
      commit("resetGame");
    },
  },
  modules: {},
  getters: {
    isFinished: (state) => state.game.isFinished(),
    game: (state) => state.game,
    totalScore: (state) => state.game.totalScore,
    currentRoll: (state) => state.currentRoll,
  },
});
