import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import { Testimonial } from './Testimonials';

const TextTestimonialContainer = styled.div();
const TextTestimonialContent = styled.div();

export function TextContent(props: { testimonial: Testimonial }) {
  const { testimonial } = props;
  const { content, id } = testimonial;

  return (
    <TextTestimonialContainer className="flex flex-col items-start justify-start h-full w-full p-[20px]">
      <TextTestimonialContent
        id={`testimonial-card-${id}`}
        className="text-left mt-8 line-clamp-6 overflow-hidden overflow-ellipsis"
      >
        {content}
      </TextTestimonialContent>
      <Link to={`/testimonials/${id}`} state={{ testimonial }}>
        See More
      </Link>
    </TextTestimonialContainer>
  );
}
