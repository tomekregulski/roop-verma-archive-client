import { Tooltip } from 'antd';
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react';
import { useId } from 'react';

interface ButtonProps
  extends Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'id' | 'type' | 'form' | 'aria-busy' | 'aria-describedby' | 'aria-label'
  > {
  callback?: MouseEventHandler<HTMLButtonElement>;
  isDisabledMessage?: string;
  name: string;
}

/** Keeps unavailable actions focusable while blocking mouse and keyboard activation. */
export function Button(props: ButtonProps) {
  const {
    callback,
    isDisabledMessage,
    name,
    type = 'button',
    'aria-describedby': describedBy,
    ...buttonProps
  } = props;
  // A disabled state always has an explanation for keyboard and screen-reader users.
  const disabled = Boolean(isDisabledMessage);
  const reasonId = useId();
  const description =
    [describedBy, disabled && isDisabledMessage ? reasonId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;
  const disabledStyles = disabled
    ? 'cursor-default bg-slate-500 text-white'
    : 'cursor-pointer bg-white text-black';

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (disabled) {
      // Removing a callback alone would still allow a submit button's default action.
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    callback?.(event);
  };

  return (
    <div>
      <Tooltip
        title={disabled ? isDisabledMessage : undefined}
        trigger={['hover', 'focus']}
        open={!disabled || !isDisabledMessage ? false : undefined}
      >
        <button
          {...buttonProps}
          aria-disabled={disabled || undefined}
          aria-describedby={description}
          onClick={handleClick}
          type={type}
          className={`block text-center w-max py-[5px] px-[25px] rounded-[5px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${disabledStyles}`}
          style={{
            border: 'solid 1px rgba(0, 180, 249, 0.872)',
            fontWeight: 400,
          }}
        >
          {name}
        </button>
      </Tooltip>
      {disabled && isDisabledMessage && (
        <span id={reasonId} className="sr-only">
          {isDisabledMessage}
        </span>
      )}
    </div>
  );
}
