import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Tooltip } from 'antd';
import type { ChangeEvent } from 'react';

interface InputProps {
  id: string;
  padding?: string;
  name: string;
  type: string;
  label: string;
  value: string | number;
  placeholder?: string;
  callback: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  tooltipContent?: string;
}

export function Input(props: InputProps) {
  const { id, padding, name, type, label, value, placeholder, callback, tooltipContent } =
    props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        color: 'black',
      }}
    >
      <label className="flex items-center" style={{ color: 'white' }} htmlFor={name}>
        {label}
        {tooltipContent && (
          <span style={{ marginLeft: '8px' }}>
            <Tooltip title={tooltipContent}>
              <QuestionMarkCircledIcon />
            </Tooltip>
          </span>
        )}
      </label>
      <input
        value={value}
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => callback(event, id)}
        style={{
          padding: padding || '5px',
          border: 'solid 1px white',
          borderRadius: '5px',
        }}
      />
    </div>
  );
}
