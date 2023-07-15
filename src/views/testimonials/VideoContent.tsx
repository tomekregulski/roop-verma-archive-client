import styled from '@emotion/styled';
import ReactPlayer from 'react-player/vimeo';

const VideoTestimonialContainer = styled.div();
const VideoTestimonialContent = styled.div();

export function VideoContent(props: { src: string }) {
  const { src } = props;
  console.log(src);
  return (
    <VideoTestimonialContainer className="flex items-center justify-center h-full w-full p-[20px]">
      <VideoTestimonialContent>
        <ReactPlayer
          className="react-player video"
          url="https://vimeo.com/482533185"
          controls
          height="200px"
          width="200px"
        />
      </VideoTestimonialContent>
    </VideoTestimonialContainer>
  );
}
