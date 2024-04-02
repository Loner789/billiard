
export default class MouseObject {
  ballIdx: number;
  startPos: { x: number, y: number };
  shift: { x: number, y: number };
  start: number;

  constructor(ballIdx: number, startPos: { x: number, y: number }, shift: { x: number, y: number }, start: number) {
    this.ballIdx = ballIdx;
    this.startPos = startPos;
    this.shift = shift;
    this.start = start;
  }
}
