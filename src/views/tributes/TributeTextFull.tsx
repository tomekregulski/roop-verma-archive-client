import { useLocation } from 'react-router-dom';

export function TributeTextFull() {
  const location = useLocation();
  const { tribute } = location.state;
  const { submittedBy, content } = tribute;

  return (
    <div className="mx-8">
      <div className="my-0 mx-auto text-center">Submitted by: {submittedBy}</div>
      <div className="text-center mt-8">{content}</div>
    </div>
  );
}
