import { SyncLoader } from 'react-spinners';

function Loading() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center">
      <SyncLoader />
    </div>
  );
}

export default Loading;
