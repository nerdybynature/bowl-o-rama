import { BowlingGame } from "../../src/types/BowlingGame";

describe("BowlingGame.ts", () => {
  let game: BowlingGame;

  beforeEach(() => {
    game = new BowlingGame();
  });

  it("can reset a game", () => {
    rollMany(1, 20);
    game.restart();
    expect(game.totalScore).toBe(0);
    expect(game.currentFrame).toBe(null);

    expect(game.isFinished()).toBe(false);
  });

  it("can calculate", () => {
    game.roll(10);
    game.roll(5);
    game.roll(5);
    game.roll(4);
    game.roll(0);
    expect(game.totalScore).toBe(38);
  });

  it("can calculate a series of 9s and 0s", () => {
    rollPattern([9, 0], 10);
    expect(game.isFinished()).toBe(true);
    expect(game.totalScore).toBe(90);
  });

  it("can calculate a bunch of spares", () => {
    rollPattern([5, 5], 10);
    game.roll(5);
    expect(game.isFinished()).toBe(true);
    expect(game.totalScore).toBe(150);
  });

  it("can roll all ones", () => {
    rollMany(1, 20);
    expect(game.totalScore).toBe(20);
    expect(game.isFinished()).toBe(true);
  });

  it("can roll all gutterballs", () => {
    rollMany(0, 20);
    expect(game.totalScore).toBe(0);
    expect(game.isFinished()).toBe(true);
  });

  it("can roll a strike", () => {
    game.roll(10);
    game.roll(2);
    game.roll(0);

    expect(game.totalScore).toBe(14);
  });

  it("can roll consecutive strikes", () => {
    game.roll(10); // 0
    game.roll(10); // 1
    game.roll(10); // 2

    game.roll(5); //3
    game.roll(0);

    expect(game.getFrameScore(game.frames[0], 0, game.frames, 2)).toBe(30);
    expect(game.getFrameScore(game.frames[1], 1, game.frames, 3)).toBe(25);
    expect(game.getFrameScore(game.frames[2], 2, game.frames, 4)).toBe(15);
  });

  it("can roll a spare", () => {
    game.roll(6);
    game.roll(4);
    game.roll(3);
    game.roll(2);

    expect(game.getFrameScore(game.frames[0], 0, game.frames, 2)).toBe(13);
  });

  it("can't roll when game is over", () => {
    rollMany(1, 20);
    expect(() => game.roll(1)).toThrow("Game is over");
  });

  it("can validate pins", () => {
    expect(() => game.roll(12)).toThrow("Submitted pins are invalid");

    expect(() => game.roll(-1)).toThrow("Submitted pins are invalid");

    game.roll(4);
    expect(() => game.roll(9)).toThrow("Nice try, cheat.");
  });

  it("can add rolls", () => {
    game.roll(3);
    game.roll(4);
    expect(game.frames[0].sum()).toBe(7);
  });

  it("can roll perfect game", () => {
    rollMany(10, 12);
    expect(game.totalScore).toBe(300);
  });

  it("can handle extra rolls", () => {
    rollMany(0, 16);
    game.roll(10);
    game.roll(10);
    game.roll(4);
    game.roll(2);
    expect(game.totalScore).toBe(40);
  });

  const rollMany = function (pins: number, rolls: number) {
    for (let i = 0; i < rolls; i++) {
      game.roll(pins);
    }
  };

  const rollPattern = (pattern: number[], rolls: number) => {
    for (let i = 0; i < rolls; i++) {
      pattern.forEach((pins) => game.roll(pins));
    }
  };
});
