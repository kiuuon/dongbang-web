import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchBlockedUserList, unblockUser } from '@/lib/apis/user';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import UserAvatar from '@/components/common/user-avatar';

function BlockListPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlockedUser, setSelectedBlockedUser] = useState<{
    id: string;
    name: string;
    nickname: string;
    avatar: string;
    deleted_at: string;
  } | null>(null);

  const { data: blockedUserList } = useQuery({
    queryKey: ['blockedUserList'],
    queryFn: fetchBlockedUserList,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.BLOCKED_USER_LIST_FETCH_FAILED),
  });

  const { mutate: handleUnblockUser } = useMutation({
    mutationFn: (userId: string) => unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUserList'] });
      setIsModalOpen(false);
      setSelectedBlockedUser(null);
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.USER.UNBLOCK_FAILED),
  });

  return (
    <div className="h-screen px-[20px] pt-[82px]">
      <Header>
        <div className="flex items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">차단 목록</div>
        </div>
      </Header>
      <div>
        {blockedUserList?.map((blockedUser) => (
          <div key={blockedUser.blockedUser.id} className="flex items-center justify-between px-[8px] py-[6px]">
            <div className="flex items-center gap-[12px]">
              <UserAvatar avatar={blockedUser.blockedUser.avatar} size={40} />
              {blockedUser.blockedUser.deleted_at ? (
                <div className="flex flex-col items-start justify-center gap-[1px]">
                  <div className="text-bold14 h-[17px] text-gray2">(알수없음)</div>
                  <div className="h-[14px]" />
                </div>
              ) : (
                <div className="flex flex-col items-start justify-center gap-[1px]">
                  <div className="text-bold14 h-[17px]">{blockedUser.blockedUser.name}</div>
                  <div className="text-regular12 h-[14px] text-gray2">{blockedUser.blockedUser.nickname}</div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="text-regular12 rounded-[16px] bg-primary p-[8px] text-white"
              onClick={() => {
                setIsModalOpen(true);
                setSelectedBlockedUser(blockedUser.blockedUser);
              }}
            >
              차단 해제
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          tabIndex={0}
          role="button"
          className="fixed bottom-0 left-0 right-0 z-50 m-auto flex h-screen w-screen max-w-[600px] items-center bg-black bg-opacity-60 px-[32px]"
          onClick={() => {
            setIsModalOpen(false);
            setSelectedBlockedUser(null);
          }}
          onKeyDown={() => {
            setIsModalOpen(false);
            setSelectedBlockedUser(null);
          }}
        >
          <div className="flex h-auto w-full flex-col items-center rounded-[20px] bg-white px-[27px] py-[24px]">
            <div className="text-bold14">
              {selectedBlockedUser?.deleted_at
                ? '(알수없음)님의 차단을 해제할까요?'
                : `${selectedBlockedUser?.name}님(${selectedBlockedUser?.nickname})님의 차단을 해제할까요?`}
            </div>

            <div className="text-regular14 mb-[24px] mt-[12px]">
              차단을 해제하면{' '}
              {selectedBlockedUser?.deleted_at
                ? '(알수없음)님'
                : `${selectedBlockedUser?.name}님(${selectedBlockedUser?.nickname})님`}
              의 피드와 댓글이 다시 보입니다
            </div>

            <button
              type="button"
              className="text-bold14 mb-[16px] text-error"
              onClick={() => {
                handleUnblockUser(selectedBlockedUser?.id as string);
              }}
            >
              차단 해제
            </button>
            <button
              type="button"
              className="text-regular14"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedBlockedUser(null);
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockListPage;
