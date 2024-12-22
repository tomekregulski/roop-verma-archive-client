import { Tooltip } from 'antd';

interface ButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: (e?: any) => void;
  isDisabledMessage?: string;
  width?: string;
  padding?: string;
  margin?: string;
  color?: string;
  borderRadius?: string;
  border?: string;
  form?: string | undefined;
  fontWeight?: string;
  name: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

export function Button(props: ButtonProps) {
  const {
    callback,
    width,
    isDisabledMessage,
    padding,
    margin,
    color,
    borderRadius,
    border,
    fontWeight,
    form,
    name,
    type,
  } = props;

  return (
    <div>
      <Tooltip title={isDisabledMessage} open={!isDisabledMessage ? false : undefined}>
        <button
          onClick={!isDisabledMessage ? callback : undefined}
          type={type || 'button'}
          form={form}
          style={{
            display: 'block',
            textAlign: 'center',
            width: width || 'auto',
            padding: padding || '10px 25px',
            backgroundColor: isDisabledMessage ? 'grey' : 'white',
            cursor: isDisabledMessage ? 'default' : 'pointer',
            margin: margin,
            color: color || 'black',
            borderRadius: borderRadius || '5px',
            border: border || 'solid 1px rgba(0, 180, 249, 0.872)',
            fontWeight: fontWeight || '400',
          }}
        >
          {name}
        </button>
      </Tooltip>
    </div>
  );
}
