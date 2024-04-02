import { Point } from "./ball";

export default class Movement {
  velocity: Point;

  constructor({ velocity }: { velocity: Point }) {
    this.velocity = velocity;
  }
}
