import { Section } from '../components/Section/Section';
import { SupportForm } from '../components/SupportForm/SupportForm';
import { SectionTitle } from '../components/Titles/SectionTitle';
import { ViewTitle } from '../components/Titles/ViewTitle';

const AboutLibrary = () => {
  return (
    <>
      <ViewTitle title="Help / How to Use the Library" />
      <Section>
        <p>
          As the library expands, this page will grow as a resource for using its various
          features.
        </p>
        <p>
          For any technical issues, please use the form below (coming soon) to submit a
          ticket.
        </p>
      </Section>
      <Section>
        <SectionTitle title="Media Player" />
        <p>
          This feature will provide access to a wide range of Roopji&apos;s audio
          recordings, taken over decades of concerts, workshops, and interviews. This
          feature is our immediate priority for expansion, and we aim to add new tracks
          regularly as they are digitized from the original cassette tapes.
        </p>
        <p>
          The media player functions similarly to most standard web players. The one
          detail to be aware of is that you need to select the track to load it to the
          player, and then press the &quot;play button&quot; to actually begin playing it.
          This two-step feature has been implemented due to certain restrictions on mobile
          devices. We hope to find a solution to smooth out the process in the future.
        </p>
        <p>
          There is a search feature above the tracklist. This allows you to search the
          entire audio library for any keywords. Clearing the field, or pressing the
          &quot;reset&quot; button will bring back the full list. Additionally, the
          &quot;surprise mev button will select a track at random.
        </p>
        <p>
          Over time, we expect to expand the search field into a more detailed filter that
          will allow for a higher level of specificity.
        </p>
      </Section>
      <SupportForm />
    </>
  );
};

export default AboutLibrary;
