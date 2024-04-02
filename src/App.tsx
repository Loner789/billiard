import React, { createContext, useState } from 'react';
import './App.css';
import Canvas from './components/canvas';
import ColorPicker from './components/colorPicker';
export const mainContext = createContext<{
  canvasRef: React.RefObject<HTMLCanvasElement> | null;
  setCanvasRef: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLCanvasElement> | null>
  > | null;
}>({
  canvasRef: null,
  setCanvasRef: null,
});

function App() {
  const canvasParams = { width: 900, height: 450 };
  const [cnvsRef, setCnvsRef] =
    useState<React.RefObject<HTMLCanvasElement> | null>(null);
  const [color, setColor] = React.useState('#FFFFFF');

  return (
    <mainContext.Provider
      value={{
        canvasRef: cnvsRef,
        setCanvasRef: setCnvsRef,
      }}
    >
      <div className='App'>
        <Canvas width={canvasParams.width} height={canvasParams.height} color={color} setColor={setColor} />
        <ColorPicker color={color} setColor={setColor} />
        <div className='description'>
          <p>Click to capture the ball</p>
          <p>Double click to change the color of the ball</p>
        </div>
      </div>
    </mainContext.Provider>
  );
}

export default App;
