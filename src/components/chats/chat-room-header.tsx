import { useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchChatRoomInfo } from '@/lib/apis/chats';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import SearchIcon2 from '@/icons/search-icon2';
import MenuIcon from '@/icons/menu-icon';
import BackButton from '../common/back-button';

function ChatRoomHeader({
  isSearchMode,
  setIsSearchMode,
  searchQuery,
  setSearchQuery,
  handleSearchConfirm,
  setInputValue,
  setInputContainerHeight,
  setIsConfirm,
}: {
  isSearchMode: boolean;
  setIsSearchMode: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchConfirm: () => void;
  setInputValue: (value: string) => void;
  setInputContainerHeight: React.Dispatch<React.SetStateAction<number>>;
  setIsConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: chatRoomInfo } = useQuery({
    queryKey: ['chatRoomInfo', chatRoomId],
    queryFn: () => fetchChatRoomInfo(chatRoomId),
    enabled: !!chatRoomId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_ROOM_INFO_FAILED),
  });

  return (
    <header className="fixed left-0 right-0 top-0 z-30 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between bg-tag px-[20px]">
      {isSearchMode ? (
        <div className="flex w-full items-center gap-[12px]">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            placeholder="검색"
            enterKeyHint="search"
            className="text-regular16 w-full rounded-[8px] bg-secondary px-[12px] py-[10px] placeholder:text-gray2"
            onFocus={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'top input focus' }));
              }
            }}
            onBlur={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'top input blur' }));
              }
            }}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearchConfirm();
              }
            }}
          />
          <button
            type="button"
            className="text-regular16 break-keep"
            onClick={() => {
              setIsSearchMode((prev) => !prev);
              setSearchQuery('');
              setIsConfirm(false);
            }}
          >
            취소
          </button>
        </div>
      ) : (
        <>
          <BackButton />
          <div className="flex items-center gap-[7px]">
            {chatRoomInfo?.club?.logo && (
              <Image
                src={chatRoomInfo?.club?.logo}
                alt="club logo"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  borderRadius: '16px',
                  width: '40px',
                  height: '40px',
                  minWidth: '40px',
                  minHeight: '40px',
                }}
              />
            )}
            <div>
              <div className="text-bold14">{chatRoomInfo?.club?.name}</div>
              <div className="text-regular12 text-gray1">{chatRoomInfo?.members.length}명</div>
            </div>
          </div>
          <div className="flex items-center gap-[20px]">
            <button
              type="button"
              onClick={() => {
                setIsSearchMode((prev) => !prev);
                setInputValue('');
                setInputContainerHeight(91);
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                });
              }}
            >
              <SearchIcon2 />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ type: 'event', action: 'go to chat room menu' }),
                  );
                  return;
                }

                router.push(`/chats/${chatRoomId}/menu`);
              }}
            >
              <MenuIcon />
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default ChatRoomHeader;
