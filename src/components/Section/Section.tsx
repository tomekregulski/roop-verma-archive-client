import type { PropsWithChildren } from 'react';

interface SectionProps extends PropsWithChildren {}

export function Section(props: SectionProps) {
  const { children } = props;
  return (
    <section
      className="
        max-w-[1000px]
        mt-[32px]
        mx-auto
        mb-0
        flex
        flex-col
        items-center
        justify-start
        gap-4
      "
    >
      {children}
    </section>
  );
}
