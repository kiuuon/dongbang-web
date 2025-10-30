import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { fetchUserId } from '@/lib/apis/auth';
import { deleteFeed } from '@/lib/apis/feed/feed';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import EditIcon from '@/icons/edit-icon';
import DeleteIcon from '@/icons/delete-icon';
import ExternalLinkIcon from '@/icons/external-link-icon';
import ReportIcon from '@/icons/report-icon';

function SettingModal({ authorId, feedId, onClose }: { authorId: string; feedId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { feedId: isFeedDetail } = router.query;

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { mutate: handleDeleteFeed } = useMutation({
    mutationFn: () => deleteFeed(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'feeds',
      });

      onClose();

      if (isFeedDetail) router.back();
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.FEED.DELETE_FAILED),
  });

  const clickEditButton = () => {
    router.push(`/feed/edit/${feedId}`);
  };

  const clickDeleteButton = () => {
    handleDeleteFeed();
  };

  const clickShareButton = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/feed/detail/${feedId}`;
      await navigator.clipboard.writeText(url);
      toast.success('피드 링크가 클립보드에 복사되었습니다!');
      onClose();
    } catch (error) {
      toast.error('피드 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex w-full flex-col items-center px-[20px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      {authorId === userId ? (
        <div className="mb-[30px] w-full rounded-[8px] bg-background">
          <button
            type="button"
            className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]"
            onClick={clickEditButton}
          >
            <EditIcon color="black" />
            수정
          </button>
          <div className="h-[1px] w-full bg-gray0" />
          <button
            type="button"
            className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]"
            onClick={clickDeleteButton}
          >
            <DeleteIcon />
            삭제
          </button>
          <div className="h-[1px] w-full bg-gray0" />
          <button
            type="button"
            className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]"
            onClick={clickShareButton}
          >
            <ExternalLinkIcon />
            공유
          </button>
        </div>
      ) : (
        <div className="mb-[30px] w-full rounded-[8px] bg-background">
          <button type="button" className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <ReportIcon />
            신고
          </button>
          <div className="h-[1px] w-full bg-gray0" />
          <div className="h-[1px] w-full bg-gray0" />
          <button
            type="button"
            className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]"
            onClick={clickShareButton}
          >
            <ExternalLinkIcon />
            공유
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingModal;
