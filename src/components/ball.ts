import Movement from "./movement";

export type Point = {
  x: number;
  y: number;
};

export default class Ball {
  position: Point;
  radius: number;
  color: string;

  movement: Movement;

  update() {
    this.position.x += this.movement.velocity.x;
    this.position.y += this.movement.velocity.y;
  }

  constructor({
    position,
    velocity,
    radius,
    color,
  }: {
    position: Point;
    velocity: Point;
    radius: number;
    color: string;
  }) {
    this.position = { ...position };
    this.radius = radius;
    this.color = color;
    this.movement = new Movement({ velocity });
  }
}
