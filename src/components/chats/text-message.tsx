import { useRouter } from 'next/router';

import { formatToTime } from '@/lib/utils';
import { MessageType } from '@/types/message-type';
import TextMessageTail from './text-message-tail';
import UserAvatar from '../common/user-avatar';

// 검색 키워드 하이라이팅 함수 (앞에서부터 첫 번째 매칭만)
const highlightSearchKeyword = (text: string, keyword: string) => {
  if (!keyword.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) return text;

  // 앞에서부터 첫 번째 매칭만 하이라이팅
  const before = text.slice(0, index);
  const matched = text.slice(index, index + keyword.length);
  const after = text.slice(index + keyword.length);

  return (
    <>
      {before}
      <mark className="bg-tertiary">{matched}</mark>
      {after}
    </>
  );
};

function TextMessage({
  message,
  messages,
  index,
  boundaryIndex,
  boundaryMessageRef,
  searchQuery,
}: {
  message: MessageType;
  messages: MessageType[];
  index: number;
  boundaryIndex: number;
  boundaryMessageRef: React.RefObject<HTMLDivElement | null>;
  searchQuery: string;
}) {
  const router = useRouter();

  // 검색어가 있으면 하이라이팅된 텍스트, 없으면 원본 텍스트
  const displayContent = searchQuery.trim()
    ? highlightSearchKeyword(message.content || '', searchQuery)
    : message.content;

  if (message.isMine) {
    if (index === 0 || messages[index - 1].sender_id !== message.sender_id) {
      return (
        <div
          ref={index === boundaryIndex ? boundaryMessageRef : null}
          className="relative mb-[8px] mt-[8px] flex items-end justify-end gap-[4px]"
        >
          <div className="flex flex-col items-end">
            {message.unread_count && message.unread_count > 0 ? (
              <div className="text-bold10 text-primary">{message.unread_count}</div>
            ) : null}
            <div className="text-regular10">{formatToTime(message.created_at)}</div>
          </div>
          <div className="text-regular14 whitespace-pre-wrap break-all rounded-[12px] bg-primary p-[12px]">
            {displayContent}
          </div>

          <div className="absolute right-[-8px] top-[3px]">
            <TextMessageTail isMine={message.isMine} />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={index === boundaryIndex ? boundaryMessageRef : null}
        className="mb-[8px] flex items-end justify-end gap-[4px]"
      >
        <div className="flex flex-col items-end">
          {message.unread_count && message.unread_count > 0 ? (
            <div className="text-bold10 text-primary">{message.unread_count}</div>
          ) : null}
          <div className="text-regular10">{formatToTime(message.created_at)}</div>
        </div>
        <div className="text-regular14 whitespace-pre-wrap break-all rounded-[12px] bg-primary p-[12px]">
          {displayContent}
        </div>
      </div>
    );
  }

  console.log(message.sender);
  if (index === 0 || messages[index - 1].sender?.id !== message.sender?.id) {
    return (
      <div className="mt-[8px] flex items-start gap-[8px]">
        <button
          type="button"
          onClick={() => {
            if (message.sender?.deleted_at) {
              return;
            }

            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to profile page', payload: message.sender?.nickname }),
              );
            } else {
              router.push(`/profile/${message.sender?.nickname}`);
            }
          }}
        >
          <UserAvatar avatar={message.sender?.avatar} size={32} />
        </button>
        <div>
          <div className={`text-bold14 mb-[4px] ${message.sender?.deleted_at ? 'text-gray2' : 'text-black'}`}>
            {message.sender?.deleted_at ? '(알수없음)' : message.sender?.club_nickname}
          </div>
          <div
            ref={index === boundaryIndex ? boundaryMessageRef : null}
            className="relative mb-[8px] flex items-end gap-[4px]"
          >
            <div className="text-regular14 whitespace-pre-wrap break-all rounded-[12px] bg-white p-[12px]">
              {displayContent}
            </div>
            <div className="flex flex-col items-start">
              {message.unread_count && message.unread_count > 0 ? (
                <div className="text-bold10 text-primary">{message.unread_count}</div>
              ) : null}
              <div className="text-regular10">{formatToTime(message.created_at)}</div>
            </div>
            <div className="absolute left-[-8px] top-[3px]">
              <TextMessageTail isMine={message.isMine} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={index === boundaryIndex ? boundaryMessageRef : null}
      className="mb-[8px] ml-[40px] flex items-end gap-[4px]"
    >
      <div className="text-regular14 whitespace-pre-wrap break-all rounded-[12px] bg-white p-[12px]">
        {displayContent}
      </div>
      <div className="flex flex-col items-start">
        {message.unread_count && message.unread_count > 0 ? (
          <div className="text-bold10 text-primary">{message.unread_count}</div>
        ) : null}
        <div className="text-regular10">{formatToTime(message.created_at)}</div>
      </div>
    </div>
  );
}

export default TextMessage;
