export function ViewTitle(props: { title: string }) {
  const { title } = props;
  return (
    <h2
      className="
          text-center 
          lg:text-[48px] 
          md:text-[36px] 
          sm:text-[20px]
        "
    >
      {title}
    </h2>
  );
}
