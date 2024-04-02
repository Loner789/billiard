import Ball from './ball';
import MouseObject from './mouse-object';

export default class BillardGame {
  balls: Ball[];
  frame: { width: number; height: number };
  mouseObject: MouseObject | undefined;

  update({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
    this.balls.forEach((obj) => {
      for (const ball of this.balls) {
        if (ball === obj) continue;
        const collision = this._detectCollision(obj, ball, this.frame);

        if (collision) {
          this._handleCollision(obj, ball, 0.5);
        }
      }

      obj.update();
    });
  }

  render({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#288055';
      ctx.fillRect(0, 0, this.frame.width, this.frame.height);

      this.balls.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      });
    }
  }

  async handleMouseClick(e: MouseEvent, mouseX: number, mouseY: number, time: number, color: string, setColor: Function) {
    if ((e.type === "mousedown" && e.button === 0) || e.type === "dblclick") {
      const ballIdx = this._getBall(mouseX, mouseY);

      if (ballIdx) {
        const ball = this.balls[ballIdx];
        if (e.type === "mousedown") {
          ball.movement.velocity = { x: 0, y: 0 };
          const startPos = ball.position;
          const shift = { x: ball.position.x - mouseX, y: ball.position.y - mouseY };
          this.mouseObject = new MouseObject(ballIdx, startPos, shift, time);
        } else if (e.type === "dblclick") {
          await setColor(ball.color);
          const picker = document.getElementById('picker-label');
          if (picker) {
            picker.click();
            const input = picker.getElementsByTagName('input')[0];
            input.onchange = (e: any) => {
              ball.color = e.target.value;
            }
          }
        }
      }
    } else if (e.type === "mouseup" && e.button === 0 && this.mouseObject) {
      const targetBall = this.balls[this.mouseObject.ballIdx];
      let fullTime = time - this.mouseObject.start;
      if (fullTime === 0) fullTime = 1000;
      const coeff = 10000 / fullTime;
      const x = (targetBall.position.x - this.mouseObject.startPos.x) / coeff;
      const y = (targetBall.position.y - this.mouseObject.startPos.y) / coeff;
      const velocity = { x: x, y: y };
      targetBall.movement.velocity = velocity;
      this.mouseObject = undefined;
    }
  }

  constructor(canvasParams: { width: number; height: number }) {
    this.frame = canvasParams;
    this.balls = [];

    // Create balls
    for (let i = 0; i < 16; i++) {
      const ballData = {
        position: this._getRandomBallPosition(),
        velocity: this._getRandomStartVelocity(1, 3),
        radius: this._getRandomBallSize(15, 45),
        color: this._getRandomBallColor(),
      };
      this.balls.push(new Ball(ballData));
    }
  }

  _getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  _getRandomBallPosition() {
    return {
      x: this._getRandomNumber(50, this.frame.width - 50),
      y: this._getRandomNumber(50, this.frame.height - 50),
    };
  }

  _getRandomStartVelocity(min: number, max: number) {
    return {
      x: this._getRandomNumber(min, max),
      y: this._getRandomNumber(min, max),
    };
  }

  _getRandomBallSize(minRadius: number, maxRadius: number) {
    return this._getRandomNumber(minRadius, maxRadius);
  }

  _getRandomBallColor() {
    let res = '',
      chars = 'abcde0123456789';

    for (let i = 0; i < 6; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }

    return `#${res}`;
  }

  _detectCollision(
    ball1: Ball,
    ball2: Ball,
    frame: { width: number; height: number }
  ): boolean {
    const ball1X = ball1.position.x + ball1.movement.velocity.x;
    const ball2X = ball2.position.x + ball2.movement.velocity.x;
    const ball1Y = ball1.position.y + ball1.movement.velocity.y;
    const ball2Y = ball2.position.y + ball2.movement.velocity.y;

    if (ball1X <= ball1.radius || ball1X >= frame.width - ball1.radius) {
      ball1.movement.velocity.x = -ball1.movement.velocity.x / 2;
    }
    if (ball1Y <= ball1.radius || ball1Y >= frame.height - ball1.radius) {
      ball1.movement.velocity.y = -ball1.movement.velocity.y / 2;
    }

    const distance = Math.hypot(
      ball2X - ball1X,
      ball2Y - (ball1.position.y - ball1.movement.velocity.y)
    );
    // const distance = Math.hypot(ball2X - ball1X, ball2Y - ball1Y);

    return distance <= ball1.radius + ball2.radius;
  }

  _handleCollision(
    ball1: Ball,
    ball2: Ball,
    speedLoss: number
  ): void {
    const collisionNormal = {
      x: ball2.position.x - ball1.position.x,
      y: ball2.position.y - ball1.position.y,
    };
    const magnitude = Math.sqrt(
      Math.pow(collisionNormal.x, 2) + Math.pow(collisionNormal.y, 2)
    );
    collisionNormal.x /= magnitude;
    collisionNormal.y /= magnitude;

    const relativeVelocity = {
      x: ball2.movement.velocity.x - ball1.movement.velocity.x,
      y: ball2.movement.velocity.y - ball1.movement.velocity.y,
    };
    const speedAlongNormal =
      relativeVelocity.x * collisionNormal.x +
      relativeVelocity.y * collisionNormal.y;

    if (speedAlongNormal > 0) {
      return; // Balls are moving away from each other, no collision
    }

    const impulseMagnitude =
      (-2 * speedAlongNormal) / (1 / ball1.radius + 1 / ball2.radius);

    const impulse = {
      x: impulseMagnitude * collisionNormal.x,
      y: impulseMagnitude * collisionNormal.y,
    };

    ball1.movement.velocity.x -= (1 / ball1.radius) * impulse.x;
    ball1.movement.velocity.y -= (1 / ball1.radius) * impulse.y;
    ball2.movement.velocity.x += (1 / ball2.radius) * impulse.x;
    ball2.movement.velocity.y += (1 / ball2.radius) * impulse.y;

    /* test */

    ball1.movement.velocity.x *= speedLoss;
    ball1.movement.velocity.y *= speedLoss;
    ball2.movement.velocity.x *= speedLoss;
    ball2.movement.velocity.y *= speedLoss;
  }

  _getBall(mouseX: number, mouseY: number) {
    for (const ball of this.balls) {
      const minX = ball.position.x - ball.radius;
      const maxX = ball.position.x + ball.radius;
      const minY = ball.position.y - ball.radius;
      const maxY = ball.position.y + ball.radius;

      if (mouseX > minX && mouseX < maxX && mouseY > minY && mouseY < maxY) {
        return this.balls.indexOf(ball);
      }
    }

    return undefined;
  }
}
