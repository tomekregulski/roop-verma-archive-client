import styled from '@emotion/styled';

import { ReactComponent as Pause } from '../../assets/pause.svg';
import { ReactComponent as Play } from '../../assets/play.svg';
import { useAudioContext } from '../../context/AudioContext';
import { getTrackTitle } from '../../util/getTrackTitle';
import type { TrackInfo } from '../TrackContainer/types';

interface TrackCardProps {
  trackInfo: TrackInfo;
  callback: (id: number) => void;
}

const TrackCard = (props: TrackCardProps) => {
  const { trackInfo, callback } = props;
  const { id, timeOfDay, name, rasa } = trackInfo;

  const { selectedTrack, playPauseValidation, isPlaying } = useAudioContext();

  const isSelected = selectedTrack && selectedTrack.id === id;
  const titleContent = getTrackTitle(trackInfo);

  // TODO: twin macro
  const CardContainer = styled.div();
  const CardBody = styled.div();
  const CardInfo = styled.div();
  const CardColumns = styled.div();
  const CardColumnLeft = styled.div();
  const CardColumnRight = styled.div();
  const CardTrackDetailsItem = styled.span();
  const CardTrackName = styled.div();

  const renderTitle = () => {
    return (
      <CardTrackName className="text-[20px]">
        {titleContent.title}
        {name !== 'unknown' && timeOfDay && (
          <CardTrackDetailsItem className="mt-2px">
            {' - ' + timeOfDay + ' Raga'}
          </CardTrackDetailsItem>
        )}
      </CardTrackName>
    );
  };

  const renderSubtitle = () => {
    return (
      <CardColumnLeft className="flex flex-col items-start">
        <CardTrackDetailsItem className="text-[14px] mt-2px">
          {titleContent.eventInfo}
        </CardTrackDetailsItem>
        {rasa && (
          <CardTrackDetailsItem className="text-[14px] mt-2px">
            {rasa}
          </CardTrackDetailsItem>
        )}
      </CardColumnLeft>
    );
  };

  const cardContainerStyles = `
    m-auto 
    w-[95%]
    max-w-[500px]
    h-[100px]
    text-black
    cursor-pointer
  `;

  const cardBackgroundColor = isSelected ? 'rgba(81, 152, 157, 0.194)' : 'white';

  return (
    <CardContainer
      id={`${id}`}
      className={cardContainerStyles}
      style={{
        backgroundColor: cardBackgroundColor,
        borderBottom: 'solid 1px rgba(0, 178, 249, 0.16)',
        boxShadow: '5px 5px 15px rgba(gray)',
      }}
    >
      <CardBody className="p-[10px]" onClick={() => callback(id)}>
        <CardInfo>
          {renderTitle()}
          <CardColumns className="flex justify-between">
            {renderSubtitle()}
            <CardColumnRight>
              {isSelected && (
                <button
                  className="
                    bg-none
                    border-none
                    bursor-pointer
                    pr-[20px]
                  "
                >
                  {isPlaying ? (
                    <Pause onClick={playPauseValidation} />
                  ) : (
                    <Play onClick={playPauseValidation} />
                  )}
                </button>
              )}
            </CardColumnRight>
          </CardColumns>
        </CardInfo>
      </CardBody>
    </CardContainer>
  );
};

export default TrackCard;
