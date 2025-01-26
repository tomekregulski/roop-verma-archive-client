import type { FormEvent, HTMLAttributes, PropsWithChildren } from 'react';

interface FormProps
  extends Pick<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'id'>,
    PropsWithChildren {
  isSubmitDisabled: boolean;
  handleSubmit: () => void;
}

export function Form(props: FormProps) {
  const { children, handleSubmit, isSubmitDisabled, ...restProps } = props;
  function internalHandleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    } else {
      handleSubmit();
    }
  }
  return (
    <form
      className="
        flex
        flex-col
        justify-center
        items-center
        gap-8
      "
      onSubmit={internalHandleSubmit}
      {...restProps}
    >
      {children}
    </form>
  );
}
