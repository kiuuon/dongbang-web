import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { deleteFeed } from '@/lib/apis/feed/feed';
import EditIcon from '@/icons/edit-icon';
import DeleteIcon from '@/icons/delete-icon';
import ExternalLinkIcon from '@/icons/external-link-icon';
import ReportIcon from '@/icons/report-icon';

function SettingModal({ authorId, feedId, onClose }: { authorId: string; feedId: string; onClose: () => void }) {
  const queryClient = useQueryClient();

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '사용자 ID를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`사용자 ID를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate: handleDeleteFeed } = useMutation({
    mutationFn: () => deleteFeed(feedId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'feeds',
      });

      onClose();
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '피드 삭제에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`피드 삭제에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  const clickEditButton = () => {};

  const clickDeleteButton = () => {
    handleDeleteFeed();
  };

  const clickShareButton = () => {};

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
