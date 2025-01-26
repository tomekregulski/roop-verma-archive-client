// import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Section } from '../../components/Section/Section';
import { ViewTitle } from '../../components/Titles/ViewTitle';
import { useAuthContext } from '../../context/AuthContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { getErrorMessage } from '../../util/getErrorMessage';
import { isValidJwt } from '../../util/isValidJwt';
import { logNetworkError } from '../../util/logNetworkError';
// import { fetchTributes } from '../../queries/tributeQueries';
import { TributeCard } from './TributeCard';

type TributeType = 'text' | 'video';

export interface Tribute {
  id: number;
  submittedBy: string;
  type: TributeType;
  content: string;
}

const key = import.meta.env.VITE_API_KEY;

export function Tributes() {
  const { updateLoadingState, updateAlertMessage } = useNotificationContext();
  const { userData } = useAuthContext();
  const [tributes, setTributes] = useState<Tribute[]>([]);
  // const { isLoading, error, isError, data } = useQuery(
  //   ['tributes'],
  //   async () => fetchTributes,
  //   {
  //     staleTime: Infinity,
  //     cacheTime: Infinity,
  //   },
  // );

  useEffect(() => {
    async function fetchTributes() {
      updateLoadingState(true);
      if (tributes.length === 0) {
        try {
          const currentJwt = isValidJwt();
          const response = await axios.get(
            `${import.meta.env.VITE_API_ORIGIN}/api/v1/tribute/${key}`,
            {
              headers: { jwt: currentJwt?.jwt },
            },
          );
          console.log(response.data);
          setTributes(response.data);
          updateLoadingState(false);
        } catch (error) {
          console.log('Failed to retrieve tributes');
          console.log(error);
          const { errorMessage, errorCode } = getErrorMessage(error);
          await logNetworkError({
            errorCode: errorCode,
            errorMessage: errorMessage,
            isRegisteredUser: true,
            userEmailAddress: userData ? userData.email : undefined,
            userName: userData
              ? `${userData?.firstName} ${userData?.firstName}`
              : undefined,
          });
          updateLoadingState(false);
          updateAlertMessage(['Failed to retrieve tributes: ', errorMessage]);
        }
      }
    }
    fetchTributes();
  }, []);

  // console.log(data);

  // useEffect(() => {
  //   updateLoadingState(isLoading);
  // }, [isLoading]);

  // useEffect(() => {
  //   if (isError && error) {
  //     updateAlertMessage([error.toString()]);
  //   }
  // }, [isError, error]);

  return (
    <>
      <ViewTitle title="Tributes" />
      <Section>
        <p className="text-center">
          Acharya Roop Verma touched the lives of countless individuals over the ocurse of
          his life. This page is a modest attempt to collect the testimonimals from some
          of those people. If you would like to contribute to this collection, please
          reach out to SOMEMAIL@EMAIL.EMAIL
        </p>
      </Section>
      {/** TODO: breakpoint to jeustify-center at smaller screensizes */}
      <div
        className="
          max-w-[90%]
          mt-[64px]
          mx-auto
          mb-[130px]
          flex
          flex-wrap
          justify-start
          gap-2
          overflow-scroll
      "
      >
        {tributes.map((tribute) => (
          <TributeCard key={tribute.id} tribute={tribute} />
        ))}
      </div>
    </>
  );
}

// export const tributes = [
//   {
//     id: 2,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
//   {
//     id: 3,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'video',
//     content: 'some/src/path',
//   },
//   {
//     id: 4,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
//   {
//     id: 5,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
//   {
//     id: 6,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
//   {
//     id: 7,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
//   {
//     id: 8,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'video',
//     content: 'some/src/path',
//   },
//   {
//     id: 9,
//     submittedBy: 'Obcaecati Fuga',
//     type: 'text',
//     content:
//       'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus dolores id nihil architecto labore hic, accusamus neque voluptatem iure, eligendi perferendis harum. Corrupti, ipsum error iusto neque distinctio explicabo eveniet similique temporibus id nisi voluptates molestias fuga obcaecati, maxime recusandae est in voluptas eum iure ad debitis dolores, harum nulla natus. Quis quisquam placeat excepturi repudiandae. Ut explicabo mollitia consectetur, obcaecati fuga illum quod expedita incidunt modi? Ex assumenda doloremque, porro velit magni repellat doloribus cupiditate similique excepturi expedita ipsa.',
//   },
// ];
