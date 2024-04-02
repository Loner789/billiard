import { useContext, useEffect, useRef, useState } from 'react';
import BillardGame from './billard-game';
import { mainContext } from '../App';

interface canvasProps {
  width: number;
  height: number;
  color: string;
  setColor: Function;
}

export default function Canvas({ width, height, color, setColor }: canvasProps) {
  const mainCTX = useContext(mainContext);

  const [game] = useState<BillardGame>(new BillardGame({ width, height }));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    let mouseX = 0, mouseY = 0;
    if (canvasRef.current) {
      mouseX = e.pageX - canvasRef.current.offsetLeft;
      mouseY = e.pageY - canvasRef.current.offsetTop;
    }
    if (e.button === 0) {
      const time = Date.parse(Date());
      game.handleMouseClick(e, mouseX, mouseY, time, color, setColor);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (canvasRef.current && game.mouseObject) {
      const mouseX = e.pageX - canvasRef.current.offsetLeft;
      const mouseY = e.pageY - canvasRef.current.offsetTop;
      const targetBall = game.balls[game.mouseObject.ballIdx];
      targetBall.position = { x: mouseX + game.mouseObject.shift.x, y: mouseY + game.mouseObject.shift.y };
    }
  }

  const update = () => {
    game.update({ canvasRef });
    game.render({ canvasRef });

    window.requestAnimationFrame(update);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      canvasRef.current.ondblclick = handleClick;
      canvasRef.current.onmousedown = handleClick;
      canvasRef.current.onmouseup = handleClick;
      canvasRef.current.onmousemove = handleMouseMove;


      if (ctx) {
        if (mainCTX.setCanvasRef) {
          mainCTX.setCanvasRef(canvasRef);
        }

        window.requestAnimationFrame(update);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      id='billiard-canvas'
      width={width}
      height={height}
      ref={canvasRef}
    />
  );
}
