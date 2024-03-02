import styled from '@emotion/styled';
import ReactPlayer from 'react-player/vimeo';

const VideoTributeContainer = styled.div();
const VideoTributeContent = styled.div();

export function VideoContent(props: { src: string }) {
  const { src } = props;
  console.log(src);
  return (
    <VideoTributeContainer className="flex items-center justify-center h-full w-full p-[20px]">
      <VideoTributeContent>
        <ReactPlayer
          className="react-player video"
          url="https://vimeo.com/482533185" // replace with {src}
          controls
          height="200px"
          width="200px"
        />
      </VideoTributeContent>
    </VideoTributeContainer>
  );
}
