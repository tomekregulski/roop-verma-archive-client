// import { ChangeEvent } from 'react';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback: (e?: any) => void;
  width?: string;
  padding?: string;
  backgroundColor?: string;
  margin?: string;
  color?: string;
  borderRadius?: string;
  border?: string;
  fontWeight?: string;
  name: string;
}

export function Button(props: ButtonProps) {
  const {
    callback,
    width,
    padding,
    backgroundColor,
    margin,
    color,
    borderRadius,
    border,
    fontWeight,
    name,
  } = props;

  return (
    <div>
      <button
        onClick={callback}
        type="submit"
        style={{
          display: 'block',
          width: width || '80px',
          padding: padding || '10px 25px',
          backgroundColor: backgroundColor || 'white',
          margin: margin,
          color: color || 'black',
          borderRadius: borderRadius || '5px',
          border: border || 'solid 1px rgba(0, 180, 249, 0.872)',
          fontWeight: fontWeight || '400',
        }}
      >
        {name}
      </button>
    </div>
  );
}
