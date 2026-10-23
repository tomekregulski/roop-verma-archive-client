import type { FormEvent, FormHTMLAttributes } from 'react';

interface FormProps
  extends Pick<
    FormHTMLAttributes<HTMLFormElement>,
    'id' | 'children' | 'aria-busy' | 'aria-describedby' | 'aria-label'
  > {
  isSubmitDisabled?: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
}

/** Guards submission independently of the submit button, including implicit submits. */
export function Form(props: FormProps) {
  const { children, handleSubmit, isSubmitDisabled = false, ...formProps } = props;
  function internalHandleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitDisabled) return;
    void handleSubmit(event);
  }
  return (
    <form
      {...formProps}
      className="flex flex-col justify-center items-center gap-8"
      onSubmit={internalHandleSubmit}
    >
      {children}
    </form>
  );
}
