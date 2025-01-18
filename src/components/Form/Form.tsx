import { FormEvent, HTMLAttributes, PropsWithChildren } from 'react';

interface FormProps
  extends Pick<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'id' | 'style'>,
    PropsWithChildren {
  isSubmitDisabled: boolean;
  handleSubmit: () => void;
}

export function Form(props: FormProps) {
  const { children, handleSubmit, isSubmitDisabled, style, ...restProps } = props;
  function internalHandleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    } else {
      handleSubmit();
    }
  }
  return (
    <form style={style} onSubmit={internalHandleSubmit} {...restProps}>
      {children}
    </form>
  );
}
