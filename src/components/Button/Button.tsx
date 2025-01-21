import { Tooltip } from 'antd';
import { MouseEventHandler } from 'react';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: MouseEventHandler<HTMLButtonElement>;
  isDisabledMessage?: string;
  form?: string | undefined;
  name: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function Button(props: ButtonProps) {
  const { callback, isDisabledMessage, form, name, type } = props;

  return (
    <div>
      <Tooltip title={isDisabledMessage} open={!isDisabledMessage ? false : undefined}>
        <button
          onClick={!isDisabledMessage ? callback : undefined}
          type={type || 'button'}
          form={form}
          className={`
            block
            text-center
            w-max
            py-[10px]
            px-[25px]
            rounded-[5px]
            ${isDisabledMessage ? 'cursor-default' : 'cursor-pointer'}
            ${isDisabledMessage ? 'bg-slate-600' : 'bg-white'}
            text-black
            font-bold
          `}
          style={{
            border: 'solid 1px rgba(0, 180, 249, 0.872)',
            fontWeight: 400,
          }}
        >
          {name}
        </button>
      </Tooltip>
    </div>
  );
}
