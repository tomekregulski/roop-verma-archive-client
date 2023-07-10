import type { Testimonial } from './Testimonials';
import { TextContent } from './TextContent';
import { VideoContent } from './VideoContent';

export function TestimonialCard(props: { testimonial: Testimonial }) {
  const { testimonial } = props;
  const { submittedBy, content, type } = testimonial;

  const Content = () => {
    switch (type) {
      case 'video':
        return <VideoContent src={content} />;
      case 'text':
        return <TextContent testimonial={testimonial} />;
      default:
        throw new Error('provided type is not a valid testimonial type.');
    }
  };

  return (
    <div className="w-[350px] h-[350px] flex flex-col justify-start items-start border p-2">
      <div className="my-0 mx-auto">Submitted by: {submittedBy}</div>
      <div>
        <Content />
      </div>
    </div>
  );
}
