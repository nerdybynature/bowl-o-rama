import { uniqueId } from "lodash";

export class BowlingGame {
  frames: Frame[];
  totalScore: number;
  currentFrame: Frame | null;
  id: string;

  constructor() {
    this.totalScore = 0;
    this.frames = [];
    this.currentFrame = null;
    this.id = uniqueId("game_");
  }

  isFinished(): boolean {
    return this.frames.length > 9 && this.frames[9].score != null;
  }

  isLastFrame(): boolean {
    return this.frames.length === 9;
  }

  restart(): void {
    this.frames.length = 0;
    this.totalScore = 0;
    this.currentFrame = null;
  }

  validatePins(pins: number): boolean {
    pins = Math.floor(pins);
    if (isNaN(pins) || pins < 0 || pins > 10) return false;

    return true;
  }

  // TODO: refactor
  setFrameScore(frame: Frame, index: number, score: number): void {
    // Frame is neither strike nor spare and roll length is greater than two ("Normal" frame)
    if (!(frame.isStrike() || frame.isSpare()) && frame.rolls.length >= 2) {
      frame.score = score;
    } else if (
      index < this.frames.length - 1 &&
      frame.isSpare() &&
      this.frames[index + 1].rolls.length > 0
    ) {
      // Frame is ot the last played frame, is a spare and the next frame has at least one roll
      frame.score = score;
    } else if (
      index < this.frames.length - 1 &&
      frame.isStrike() &&
      (this.frames[index + 1].rolls.length > 1 ||
        (index < this.frames.length - 2 &&
          this.frames[index + 1].isStrike() &&
          (this.frames[index + 2].isStrike() ||
            this.frames[index + 1].rolls.length > 0)))
    ) {
      // Frame is not the last played frame AND is a stike AND the next frame has at least 2 rolls
      // OR Frame is not the last played frame and it and next frame are strikes and second next frame has at least one roll
      // OR Frame is not the last played frame and it's three consecutive strikes.
      frame.score = score;
    } else if (
      frame.isLastFrame &&
      (frame.rolls.length === 3 ||
        (frame.rolls.length === 2 && !frame.isSpare() && !frame.isStrike()))
    ) {
      // Last frame of game AND it either has three rolls OR only has two roll but and is neither a spare nor srike
      frame.score = score;
    }
  }

  calculate(frame: Frame, frames: Frame[]): number {
    let score = 0;
    frames.forEach((frame, index, frames) => {
      if (index > 9) return;
      score += this.getFrameScore(frame, index, frames, index + 2);

      this.setFrameScore(frame, index, score);
    });

    return score;
  }

  getFrameScore(
    frame: Frame,
    index: number,
    frames: Frame[],
    limit: number
  ): number {
    let score = 0;
    if (index === limit) {
      // Triggered when there's two consecutive strikes
      score = frame.rolls[0].score;
    } else if (frame.isLastFrame && limit === 11) {
      // If last frame of game; add rolls
      score = frame.sum();
    } else {
      //
      score =
        frame.rolls.length > 1
          ? frame.rolls[0].score + frame.rolls[1].score
          : frame.rolls[0].score;
    }

    // If frame is strike and frame is not the last played frame
    // and its not the "limit" frame.
    if (
      frame.isStrike() &&
      index < limit &&
      !(index === this.frames.length - 1)
    ) {
      // If next frame is spare; add scores of first two rolls
      // Else recursively get next frame's score
      if (frames[index + 1].isSpare()) {
        score +=
          frames[index + 1].rolls[0].score + frames[index + 1].rolls[1].score;
      } else {
        score += this.getFrameScore(
          frames[index + 1],
          index + 1,
          frames,
          limit
        );
      }
    } else if (frame.isSpare() && !(index === this.frames.length - 1)) {
      // Add score from first roll of next frame.
      score += frames[index + 1].rolls[0].score;
    }
    return score;
  }

  roll(pins: number): void {
    if (this.isFinished()) throw new Error("Game is over");
    if (!this.validatePins(pins)) throw new Error("Submitted pins are invalid");

    this.currentFrame = this.currentFrame ?? new Frame(this.isLastFrame());
    if (!this.currentFrame.isLastFrame) {
      if (
        !this.currentFrame.isFirstRoll() &&
        pins + this.currentFrame.sum() > 10
      )
        throw new Error("Nice try, cheat.");

      if (this.currentFrame.rolls.length === 0) {
        this.frames.push(this.currentFrame);
      }
      this.currentFrame.addRoll(pins);
      this.totalScore = this.calculate(this.currentFrame, this.frames);

      if (this.currentFrame.isStrike() || this.currentFrame.rolls.length >= 2) {
        this.currentFrame = null;
      }
    } else {
      if (this.currentFrame.rolls.length === 0) {
        this.frames.push(this.currentFrame);
      }
      this.currentFrame.addRoll(pins);
      this.totalScore = this.calculate(this.currentFrame, this.frames);
      if (this.currentFrame.rolls.length > 2) {
        this.currentFrame = null;
      } else if (
        this.currentFrame.rolls.length > 1 &&
        !(this.currentFrame.isStrike() || this.currentFrame.isSpare())
      ) {
        this.currentFrame = null;
      }
    }
  }
}

export class Frame {
  rolls: Roll[];
  score: number | null;
  isLastFrame: boolean;
  id: string;

  constructor(isLastFrame = false) {
    this.rolls = [];
    this.score = null;
    this.isLastFrame = isLastFrame;
    this.id = uniqueId("frame_");
  }

  isStrike(): boolean {
    return this.rolls[0].score === 10;
  }

  isSpare(): boolean {
    return (
      this.rolls.length >= 2 &&
      this.rolls[0].score < 10 &&
      this.rolls[0].score + this.rolls[1].score === 10
    );
  }

  addRoll(pins: number): void {
    this.rolls.push(new Roll(pins));
  }
  sum(): number {
    return this.rolls.reduce((acc, curr) => acc + curr.score, 0);
  }
  isFirstRoll(): boolean {
    return this.rolls.length === 0;
  }
}

class Roll {
  score: number;
  id: string;

  constructor(pins: number) {
    this.score = pins;
    this.id = uniqueId("roll_");
  }
}
