import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Tooltip } from 'antd';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { useId } from 'react';

interface InputProps
  extends Pick<
    InputHTMLAttributes<HTMLInputElement>,
    | 'required'
    | 'maxLength'
    | 'minLength'
    | 'pattern'
    | 'placeholder'
    | 'autoComplete'
    | 'inputMode'
    | 'aria-describedby'
    | 'aria-busy'
    | 'aria-invalid'
  > {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string | number;
  callback: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  tooltipContent?: string;
  isDisabledMessage?: string;
}

/** Unavailable text fields stay focusable, with an explanation and blocked edits. */
export function Input(props: InputProps) {
  const {
    id,
    name,
    type,
    label,
    value,
    callback,
    tooltipContent,
    isDisabledMessage,
    'aria-describedby': describedBy,
    ...inputProps
  } = props;
  const disabled = Boolean(isDisabledMessage);
  const reasonId = useId();
  const description =
    [describedBy, disabled ? reasonId : undefined].filter(Boolean).join(' ') || undefined;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        color: 'black',
      }}
    >
      <label className="flex items-center" style={{ color: 'white' }} htmlFor={id}>
        {label}
        {tooltipContent && (
          <span style={{ marginLeft: '8px' }}>
            <Tooltip title={tooltipContent}>
              <QuestionMarkCircledIcon />
            </Tooltip>
          </span>
        )}
      </label>
      <Tooltip title={isDisabledMessage} trigger={['hover', 'focus']}>
        <input
          {...inputProps}
          value={value}
          type={type}
          id={id}
          name={name}
          // readOnly prevents native edits without removing the field from the tab order.
          readOnly={disabled}
          aria-disabled={disabled || undefined}
          aria-describedby={description}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (disabled) return;
            callback(event, id);
          }}
          style={{
            padding: '5px',
            border: 'solid 1px white',
            borderRadius: '5px',
          }}
        />
      </Tooltip>
      {disabled && (
        <span id={reasonId} className="sr-only">
          {isDisabledMessage}
        </span>
      )}
    </div>
  );
}
