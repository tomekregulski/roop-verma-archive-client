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
    submittedBy: 'name1',
    type: 'video',
    content: 'some/src/path',
  },
  {
    id: 2,
    submittedBy: 'name2',
    type: 'text',
    content:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
  },
];

export function Testimonials() {
  return (
    <div className="mx-8">
      <h1>Testimonials</h1>
      <p>
        Acharya Roop Verma touched the lives of countless individuals over the ocurse of
        his life. This page is a modest attempt to collect the testimonimals from some of
        those people. If you would like to contribute to this collection, please reach out
        to SOMEMAIL@EMAIL.EMAIL
      </p>
      <div className="flex flex-wrap justify-start items-center mx-4">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
      </div>
    </div>
  );
}
