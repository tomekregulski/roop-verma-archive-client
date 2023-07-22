// import React, { useContext, useEffect } from 'react';

// import { useAuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { isValidJwt } from '../Utils/isValidJwt';

const AboutRoopji = () => {
  // const { isAuth, userData } = useAuthContext();

  // let navigate = useNavigate();

  // useEffect(() => {
  //     if (!isValidJwt) {
  //         setUserData({});
  //         setIsAuth(false);
  //         document.cookie =
  //             'roop-verma-library= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  //         navigate('/');
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        maxWidth: '1000px',
      }}
    >
      <h1>About the Acharya Roop Verma Library</h1>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'center',
          margin: '0 auto',
          maxWidth: '1000px',
        }}
      >
        <p>
          When Roop Verma arrived in the West from his native land of India, he was well
          received for the deeply meditative quality of his music. Contained in this
          library are the unpublished gems, mostly of his meditative music, including his
          earliest recordings starting from 1977.
        </p>
        <p>
          By the time he performed his last concert on March 3, 2017 and soon left his
          body on March 11, 2017, he left behind a wake of music, including hundreds of
          mostly cassette tapes, too precious not to be preserved. Because of the sheer
          volume of recordings, these will be added to the library gradually over time as
          they are digitized. I’m grateful to Roopji’s senior student, Tomek Regulski who
          was prompted and directed by our son, Arjun Verma, to create and design this
          library so that those of you who were deeply touched by Roopji’s music can
          re-experience those magical moments.
        </p>
        <p>
          You may recall when he played during morning meditation programs or meditative
          concerts at Ananda Ashram or Nada Yoga Intensives which he innovated and became
          widely known for in the USA, Europe, Africa or S. America or any of his concerts
          in the USA, Europe, or India where you were transported to a profound experience
          of meditation.
        </p>
        <p>
          For those who are new to his music, may you experience the transcendent quality
          of his music, connecting to the very source of your being and the All That Is.
        </p>
        <p>
          If you are looking for a polished professional recording quality, his recordings
          are widely available, such as his <a href="www.roopverma.com">website</a>, or
          for download at <a href="www.CDBaby.com">CDBaby</a>.
        </p>
        <p>
          Interviews, music classes and a few precious videos will be added over time.
        </p>
        <p>
          During the last years of his life, he spoke often about the theme of Continuum.
          He was composing numerous pieces up until his final days, which we will never
          hear. But contained herein is what you can hear – his Continuum.
        </p>
        <p>
          He often suggested that the way to listen to his music is similar to when you
          sit by the ocean. You do not think about the waves or the sunshine, sand and
          breeze. You just listen and feel. Note: 10% of proceeds from your subscription
          will be donated to the East-West School of Music, which he founded at Ananda
          Ashram in 1978. It eventually became part of the International Schools of East
          West Unity (Gurukula), Inc. (ISEWU), which is recognized as a tax-exempt
          educational organization, 501(c)(3).
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'center',
          }}
        >
          <div>With love and light,</div>
          <div>Tracy Verma</div>
        </div>
      </div>
    </div>
  );
};

export default AboutRoopji;
