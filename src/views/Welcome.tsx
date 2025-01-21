import { Link } from 'react-router-dom';

import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import { useAuthContext } from '../context/AuthContext';
import { Login } from './Login';

function LibraryLink() {
  return (
    <Link
      to="audio"
      className="
        block
        text-center
        w-max
        py-[10px]
        px-[25px]
        rounded-[5px]
        cursor-pointer
        bg-white
        text-black
        font-bold
      "
    >
      Explore the Audio Library
    </Link>
  );
}

export function Welcome() {
  const { userData, isAuth } = useAuthContext();

  const name = isAuth ? ` ${userData && userData.firstName}` : '';

  return (
    <div className="text-center">
      <ViewTitle title={`Welcome${name}!`} />
      {!isAuth ? (
        <Section>
          <p>
            If you are a subscriber, please login through the form below. If you would
            like to register as a new user, please click &quot;Sign Up&quot; below, and
            follow the instructions.
          </p>
          <p>
            Otherwise, we have made a small selection of materials available to the
            public. Additionally, you can explore the other pages to learn more about
            Roopji and this project
          </p>
          <LibraryLink />
          <Login />
        </Section>
      ) : (
        <>
          <Section>
            <p>Please use the navigation above to move throught the app</p>
            <LibraryLink />
          </Section>
        </>
      )}
    </div>
  );
}
