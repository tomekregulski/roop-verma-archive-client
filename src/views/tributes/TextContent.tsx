import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

import type { Tribute } from './Tributes';

const TextTributeContainer = styled.div();
const TextTributeContent = styled.div();

export function TextContent(props: { tribute: Tribute }) {
  const { tribute } = props;
  const { content, id } = tribute;

  return (
    <TextTributeContainer className="flex flex-col items-start justify-start h-full w-full p-[20px]">
      <TextTributeContent
        id={`tribute-card-${id}`}
        className="text-left mt-8 line-clamp-6 overflow-hidden overflow-ellipsis"
      >
        {content}
      </TextTributeContent>
      <Link to={`/tributes/${id}`} state={{ tribute }}>
        See More
      </Link>
    </TextTributeContainer>
  );
}
