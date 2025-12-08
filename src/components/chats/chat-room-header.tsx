import BackButton from '../common/back-button';

function ChatRoomHeader() {
  return (
    <header className="bg-transparent fixed left-0 right-0 top-0 z-30 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between px-[20px]">
      <BackButton />
    </header>
  );
}

export default ChatRoomHeader;
