import { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  margin?: string;
  padding?: string;
  labelColor: string;
  name: string;
  type: string;
  label: string;
  value: string | number;
  placeholder?: string;
  callback: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
}

export function Input(props: InputProps) {
  const {
    id,
    margin,
    padding,
    labelColor,
    name,
    type,
    label,
    value,
    placeholder,
    callback,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: margin,
      }}
    >
      <label style={{ color: labelColor }} htmlFor={name}>
        {label}
      </label>
      <input
        value={value}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => callback(event, id)}
        style={{
          margin: margin || '0 15px 0 0',
          padding: padding || '5px',
          border: 'solid 1px white',
          borderRadius: '5px',
        }}
      />
    </div>
  );
}