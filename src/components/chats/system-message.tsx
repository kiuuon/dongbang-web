import { MessageType } from '@/types/message-type';

function SystemMessage({
  message,
  index,
  boundaryIndex,
  boundaryMessageRef,
}: {
  message: MessageType;
  index: number;
  boundaryIndex: number;
  boundaryMessageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { group_messages: groupMessages } = message as { group_messages: MessageType[] };
  const metadataType = groupMessages[0].metadata?.type;
  const userNames = groupMessages
    .map((m: any) => m.metadata?.user_name || m.metadata?.user_names?.[0] || '알 수 없음')
    .filter((name: string) => name !== '알 수 없음');

  let content = '';
  if (metadataType === 'user_joined') {
    content = `${userNames.join('님, ')}님이 들어왔습니다.`;
  } else if (metadataType === 'user_left') {
    content = `${userNames.join('님, ')}님이 나갔습니다.`;
  } else if (metadataType === 'user_on_leave') {
    content = `${userNames.join('님, ')}님이 휴학했습니다.`;
  } else if (metadataType === 'user_graduated') {
    content = `${userNames.join('님, ')}님이 졸업했습니다.`;
  } else {
    // 기본값 (첫 번째 메시지의 content 사용)
    content = groupMessages[0].content || '';
  }

  return (
    <div
      ref={index === boundaryIndex ? boundaryMessageRef : null}
      className="text-regular14 mx-auto mb-[8px] w-fit max-w-full rounded-[16px] bg-gray3 px-[12px] py-[6px] text-white opacity-60"
    >
      {content}
    </div>
  );
}

export default SystemMessage;
