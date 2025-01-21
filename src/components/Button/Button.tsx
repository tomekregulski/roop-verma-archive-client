import { Tooltip } from 'antd';
import { MouseEventHandler } from 'react';

interface ButtonProps {
  callback?: MouseEventHandler<HTMLButtonElement>;
  isDisabledMessage?: string;
  form?: string | undefined;
  name: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function Button(props: ButtonProps) {
  const { callback, isDisabledMessage, form, name, type } = props;

  const disabledStyles = isDisabledMessage
    ? 'cursor-default bg-slate-500 text-white'
    : 'cursor-pointer bg-white text-black';

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
            py-[5px]
            px-[25px]
            rounded-[5px]
            ${disabledStyles}
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
