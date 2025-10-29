import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

import { generateBase62Code } from '@/lib/utils';
import { fetchMyRole } from '@/lib/apis/club';
import { fetchInviteCode, createInviteCode, deleteInviteCode } from '@/lib/apis/invite';
import DuplicateIcon from '@/icons/duplicate-icon';
import TrashIcon from '@/icons/trash-icon';
import ShareIcon from '@/icons/share-icon';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function RecruitPage() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const queryClient = useQueryClient();

  const { data: code } = useQuery({
    queryKey: ['inviteCode', clubId],
    queryFn: () => fetchInviteCode(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '초대 코드를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { data: myRole, isPending } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const { mutate: handleCreateCode } = useMutation({
    mutationFn: (newCode: string) => createInviteCode(clubId, newCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCode', clubId] });
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '초대 링크 발급에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`초대 링크 발급에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  const { mutate: handleDeleteCode } = useMutation({
    mutationFn: () => deleteInviteCode(clubId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inviteCode', clubId] });
    },
    onError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '초대 링크 삭제에 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return;
      }
      alert(`초대 링크 삭제에 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
    },
  });

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ClipLoader size={30} color="#F9A825" />
      </div>
    );
  }

  if (myRole === 'member') {
    router.replace(`/club/${clubId}`);
    return null;
  }

  const issueInvitationLink = () => {
    const newCode = generateBase62Code(8);
    handleCreateCode(newCode);
  };

  const deleteInvitationLink = () => {
    handleDeleteCode();
  };

  const copyToClipboard = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/invite/${code}`;
      await navigator.clipboard.writeText(url);
      toast.success('초대 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('초대 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex h-screen flex-col gap-[20px] px-[20px] pt-[64px]">
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col gap-[9px]">
        <h1 className="text-regular20 h-[24px]">모집 설정</h1>
        <p className="text-regular16 h-[19px] text-gray2">동아리 모집 과정을 관리하세요</p>
      </div>
      <div>
        {code ? (
          <div className="flex w-full flex-row justify-between rounded-[9px] pb-[21px] pl-[26px] pr-[32px] pt-[22px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]">
            <span
              role="button"
              tabIndex={0}
              className="text-regular16 truncate text-gray1"
              onClick={copyToClipboard}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  copyToClipboard();
                }
              }}
            >{`${process.env.NEXT_PUBLIC_SITE_URL}/invite/${code}`}</span>
            <div className="ml-[18px] flex flex-row gap-[18px]">
              <button type="button" onClick={copyToClipboard}>
                <DuplicateIcon />
              </button>
              <button type="button" onClick={deleteInvitationLink}>
                <TrashIcon />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full flex-row gap-[7px] rounded-[9px] px-[24px] pb-[21px] pt-[22px] shadow-[0px_1px_24px_0px_rgba(0,0,0,0.08)]"
            onClick={issueInvitationLink}
          >
            <ShareIcon />
            <p>초대 코드 발급</p>
          </button>
        )}
      </div>
    </div>
  );
}

export default RecruitPage;
