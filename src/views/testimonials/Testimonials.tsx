import styled from '@emotion/styled';

import { TestimonialCard } from './TestimonialCard';

type TestimonialType = 'text' | 'video';

export interface Testimonial {
  id: number;
  submittedBy: string;
  type: TestimonialType;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    submittedBy: 'Obcaecati Fuga',
    type: 'video',
    content: 'some/src/path',
  },
  {
    id: 2,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
  {
    id: 3,
    submittedBy: 'Obcaecati Fuga',
    type: 'video',
    content: 'some/src/path',
  },
  {
    id: 4,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
  {
    id: 5,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
  {
    id: 6,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
  {
    id: 7,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
  {
    id: 8,
    submittedBy: 'Obcaecati Fuga',
    type: 'video',
    content: 'some/src/path',
  },
  {
    id: 9,
    submittedBy: 'Obcaecati Fuga',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
];

const TestimonialsWrapper = styled.div();
const TestimonialsList = styled.div();

export function Testimonials() {
  return (
    <TestimonialsWrapper className="mx-8 text-center">
      <h1>Testimonials</h1>
      <p>
        Acharya Roop Verma touched the lives of countless individuals over the ocurse of
        his life. This page is a modest attempt to collect the testimonimals from some of
        those people. If you would like to contribute to this collection, please reach out
        to SOMEMAIL@EMAIL.EMAIL
      </p>
      {/** breakpoint to justify-center at smaller screensizes */}
      <TestimonialsList className="flex flex-wrap justify-start items-center mx-4 mt-8 gap-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </TestimonialsList>
    </TestimonialsWrapper>
  );
}
