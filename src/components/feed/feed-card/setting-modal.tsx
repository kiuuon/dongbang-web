import { useQuery } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import EditIcon from '@/icons/edit-icon';
import DeleteIcon from '@/icons/delete-icon';
import ExternalLinkIcon from '@/icons/external-link-icon';
import HideIcon from '@/icons/hide-icon';
import ReportIcon from '@/icons/report-icon';

function SettingModal({ authorId }: { authorId: string }) {
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

  return (
    <div className="flex w-full flex-col items-center px-[20px]">
      <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1" />
      {authorId === userId ? (
        <div className="mb-[30px] w-full rounded-[8px] bg-background">
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <EditIcon color="black" />
            수정
          </div>
          <div className="h-[1px] w-full bg-gray0" />
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <DeleteIcon />
            삭제
          </div>
          <div className="h-[1px] w-full bg-gray0" />
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <ExternalLinkIcon />
            공유
          </div>
        </div>
      ) : (
        <div className="mb-[30px] w-full rounded-[8px] bg-background">
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <ExternalLinkIcon />
            공유
          </div>
          <div className="h-[1px] w-full bg-gray0" />
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <HideIcon />이 글 숨기기
          </div>
          <div className="h-[1px] w-full bg-gray0" />
          <div className="text-bold16 flex h-[66px] min-h-[66px] items-center gap-[30px] px-[48px]">
            <ReportIcon />
            신고
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingModal;
