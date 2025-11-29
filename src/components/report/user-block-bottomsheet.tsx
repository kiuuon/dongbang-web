import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockUser } from '@/lib/apis/user';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

function UserBlockBottomSheet({
  userId,
  username,
  nickname,
  feedId,
  commentId,
  onClose,
}: {
  userId: string;
  username: string;
  nickname: string;
  feedId?: string;
  commentId?: string;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const { mutate: handleBlockUser } = useMutation({
    mutationFn: () => blockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockStatus', nickname] });

      if (feedId) {
        queryClient.invalidateQueries({ queryKey: ['feedDetail', feedId] });
      }

      if (commentId) {
        queryClient.invalidateQueries({
          predicate: (q) => q.queryKey[0] === 'rootCommentList',
        });

        queryClient.invalidateQueries({
          predicate: (q) => q.queryKey[0] === 'replyCommentList',
        });
      }

      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'feeds',
      });
      onClose();
    },

    onError: (error) => handleMutationError(error, ERROR_MESSAGE.USER.BLOCK_FAILED),
  });

  return (
    <div className="flex w-full flex-col items-center px-[24px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[24px]">신고가 접수되었습니다</div>
      <div className="text-regular12 mb-[16px] text-gray1">
        사용자를 차단할 수 있어요. 차단하면 서로의 피드와 댓글, 동아리 활동을 더 이상 볼 수 없습니다.
      </div>

      <button
        type="button"
        className="text-bold12 mb-[32px] mt-[12px] w-full rounded-[24px] bg-primary py-[21px] text-center text-white"
        onClick={() => handleBlockUser()}
      >
        {username}({nickname}) 차단
      </button>

      <div className="text-regular12 mb-[20px] text-gray1">
        차단상태는 계정 관리 &gt; 차단 목록에서 언제든 해제할 수 있습니다.
      </div>
    </div>
  );
}

export default UserBlockBottomSheet;
