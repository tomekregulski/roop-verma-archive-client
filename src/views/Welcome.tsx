import { Link } from 'react-router-dom';

import { Button } from '../components/Button/Button';
import { Section } from '../components/Section/Section';
import { ViewTitle } from '../components/Titles/ViewTitle';
import { useAuthContext } from '../context/AuthContext';
import { Login } from './Login';

export function Welcome() {
  const { userData, isAuth } = useAuthContext();

  const name = isAuth ? ` ${userData && userData.firstName}` : '';

  return (
    <>
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
          <Link to="audio">
            <Button
              name="Explore the Audio Library"
              callback={() => {
                return null;
              }}
            />
          </Link>
          <Login />
        </Section>
      ) : (
        <>
          <Section>Please use the navigation above to move throught the app</Section>
          <Link to="audio">
            <Button
              name="Explore the Audio Library"
              callback={() => {
                return null;
              }}
            />
          </Link>
        </>
      )}
    </>
  );
}
