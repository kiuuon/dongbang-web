import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchChatRoomInfo } from '@/lib/apis/chats';
import { isValidUUID, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import AccessDeniedPage from '@/components/common/access-denied-page';

function useChatPageValidation() {
  const router = useRouter();
  const { chatRoomId } = router.query as { chatRoomId: string };
  const isValid = isValidUUID(chatRoomId);

  const {
    data: chatRoomInfo,
    isPending: isChatRoomInfoPending,
    isSuccess: isChatRoomInfoSuccess,
  } = useQuery({
    queryKey: ['chatRoomInfo', chatRoomId],
    queryFn: () => fetchChatRoomInfo(chatRoomId),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CHATS.FETCH_ROOM_INFO_FAILED),
  });

  if ((chatRoomId && !isValid) || (isChatRoomInfoSuccess && !chatRoomInfo && !isChatRoomInfoPending)) {
    return {
      isValid: false,
      chatRoomId: chatRoomId as string,
      chatRoomInfo: null,
      isPending: false,
      ErrorComponent: <AccessDeniedPage title="동아리를 찾을 수 없어요." content="존재하지 않는 동아리입니다." />,
    };
  }

  return {
    isValid: true,
    chatRoomId: chatRoomId as string,
    chatRoomInfo,
    isPending: isChatRoomInfoPending,
    ErrorComponent: null,
  };
}

export default useChatPageValidation;
