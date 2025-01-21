export function SectionTitle(props: { title: string }) {
  const { title } = props;
  return (
    <h3
      className="
        text-center 
        lg:text-[36px] 
        md:text-[20px] 
        sm:text-[16px]
      "
    >
      {title}
    </h3>
  );
}
