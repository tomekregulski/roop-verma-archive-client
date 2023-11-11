import styled from '@emotion/styled';

import { TextContent } from './TextContent';
import type { Tribute } from './Tributes';
import { VideoContent } from './VideoContent';

export function TributeCard(props: { tribute: Tribute }) {
  const { tribute } = props;
  const { submittedBy, content, type } = tribute;

  const TributeContent = () => {
    switch (type) {
      case 'video':
        return <VideoContent src={content} />;
      case 'text':
        return <TextContent tribute={tribute} />;
      default:
        throw new Error('provided type is not a valid tribute type.');
    }
  };

  const TextimonialCardWrapper = styled.div();
  const TextimonialSubmittedBy = styled.div();

  return (
    <TextimonialCardWrapper className="w-[350px] h-[350px] flex flex-col justify-start items-start border p-2">
      <TextimonialSubmittedBy className="my-0 mx-auto">
        Submitted by: {submittedBy}
      </TextimonialSubmittedBy>
      <TributeContent />
    </TextimonialCardWrapper>
  );
}
