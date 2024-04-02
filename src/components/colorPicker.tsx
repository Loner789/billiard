import { ChangeEvent } from "react";

interface pickerProps {
  color: string;
  setColor: Function;
}

export default function ColorPicker({color, setColor}: pickerProps) {
  const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  }

  return (
    <label htmlFor="color-picker" id="picker-label">
      <input type="color" id="color-picker" value={color} onChange={onColorChange} />
    </label>
  );
}
