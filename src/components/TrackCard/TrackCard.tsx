/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './trackCard.css';

import styled from '@emotion/styled';

import { ReactComponent as Pause } from '../../assets/pause.svg';
import { ReactComponent as Play } from '../../assets/play.svg';
import { /*  Track, */ useAudioContext } from '../../context/AudioContext';
import { getTrackTitle } from '../../util/getTrackTitle';
import { TrackInfo } from '../TrackContainer/TrackContainer';

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

  return (
    <CardContainer
      id={`${id}`}
      className={`max-w-[500px]
        ${isSelected ? 'card--container card--container-playing' : 'card--container'}`}
    >
      <CardBody className="p-[10px]" onClick={() => callback(id)}>
        <CardInfo>
          {renderTitle()}
          <CardColumns className="flex justify-between">
            {renderSubtitle()}
            <CardColumnRight>
              {isSelected && (
                <button className="play audio-controls--button pr-[20px]">
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
