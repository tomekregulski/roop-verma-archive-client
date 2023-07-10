import { useLocation } from 'react-router-dom';

export function TestimonialTextFull() {
  const location = useLocation();
  const { testimonial } = location.state;
  const { submittedBy, content } = testimonial;

  return (
    <div className="mx-8">
      <div className="my-0 mx-auto text-center">Submitted by: {submittedBy}</div>
      <div className="text-center mt-8">{content}</div>
    </div>
  );
}
