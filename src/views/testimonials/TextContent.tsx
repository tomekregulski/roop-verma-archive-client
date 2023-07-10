import { Link } from 'react-router-dom';

import { Testimonial } from './Testimonials';

export function TextContent(props: { testimonial: Testimonial }) {
  const { testimonial } = props;
  const { content, id } = testimonial;

  console.log(id);

  return (
    <div>
      <div
        id={`testimonial-card-${id}`}
        className="text-center mt-8 line-clamp-6 overflow-hidden overflow-ellipsis"
      >
        {content}
      </div>
      <Link to={`/testimonials/${id}`} state={{ testimonial }}>
        See More
      </Link>
    </div>
  );
}
