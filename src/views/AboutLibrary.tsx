import { SupportForm } from '../components/SupportForm/SupportFOrm';

const AboutLibrary = () => {
  return (
    <div className="help__container">
      <section className="help__section">
        <h2>Help / How to Use the Library</h2>
        <p>
          As the library expands, this page will grow as a resource for using its various
          features.
        </p>
        <p>
          For any technical issues, please use the form below (coming soon) to submit a
          ticket.
        </p>
      </section>
      <section className="help__section">
        <h2>Media Player</h2>
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
      </section>
      {/** TODO: make into its own page */}
      <SupportForm />
    </div>
  );
};

export default AboutLibrary;
