import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { report } from '@/lib/apis/report';
import { ERROR_MESSAGE } from '@/lib/constants';
import { handleMutationError } from '@/lib/utils';
import UserBlockBottomSheet from './user-block-bottomsheet';

const REPORT_ITEMS = {
  spam: '스팸/광고 계정입니다',
  illegal: '불법/유해한 내용을 올리는 계정입니다',
  impersonation: '사칭 계정입니다',
};

function UserReportBottomSheet({
  usreId,
  username,
  nickname,
  onClose,
}: {
  usreId: string;
  username: string;
  nickname: string;
  onClose: () => void;
}) {
  const [selectedReportItem, setSelectedReportItem] = useState<keyof typeof REPORT_ITEMS | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: handleReport } = useMutation({
    mutationFn: () => report('user', usreId, REPORT_ITEMS[selectedReportItem as keyof typeof REPORT_ITEMS]),
    onSuccess: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      handleMutationError(error, ERROR_MESSAGE.REPORT.REPORT_FAILED);
    },
  });

  const handleReportButtonClick = () => {
    if (!selectedReportItem) {
      return;
    }
    handleReport();
  };

  if (isSuccess) {
    return <UserBlockBottomSheet userId={usreId} username={username} nickname={nickname} onClose={onClose} />;
  }

  return (
    <div className="flex w-full flex-col items-center px-[24px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[24px]">신고</div>
      <div className="text-regular12 mb-[16px] text-gray1">
        이 사용자를 신고하는 이유를 알려주세요. 신고 내용은 동방 운영팀이 검토하며 , 익명으로 처리됩니다.
      </div>
      <div className="flex w-full flex-col gap-[8px]">
        <button
          type="button"
          className={`flex h-[56px] w-full items-center justify-between gap-[8px] rounded-[8px] border border-gray0 pl-[24px] pr-[17px] ${selectedReportItem === 'spam' ? 'bg-background' : 'bg-white'}`}
          onClick={() => setSelectedReportItem('spam')}
        >
          {REPORT_ITEMS.spam}
          <div
            className={`${selectedReportItem === 'spam' ? 'bg-black' : 'border border-gray0 bg-white'} h-[20px] w-[20px] rounded-full`}
          />
        </button>
        <button
          type="button"
          className={`flex h-[56px] w-full items-center justify-between gap-[8px] rounded-[8px] border border-gray0 pl-[24px] pr-[17px] ${selectedReportItem === 'illegal' ? 'bg-background' : 'bg-white'}`}
          onClick={() => setSelectedReportItem('illegal')}
        >
          {REPORT_ITEMS.illegal}
          <div
            className={`${selectedReportItem === 'illegal' ? 'bg-black' : 'border border-gray0 bg-white'} h-[20px] w-[20px] rounded-full`}
          />
        </button>
        <button
          type="button"
          className={`flex h-[56px] w-full items-center justify-between gap-[8px] rounded-[8px] border border-gray0 pl-[24px] pr-[17px] ${selectedReportItem === 'impersonation' ? 'bg-background' : 'bg-white'}`}
          onClick={() => setSelectedReportItem('impersonation')}
        >
          {REPORT_ITEMS.impersonation}
          <div
            className={`${selectedReportItem === 'impersonation' ? 'bg-black' : 'border border-gray0 bg-white'} h-[20px] w-[20px] rounded-full`}
          />
        </button>
        <div className="h-[56px] w-full" />
      </div>
      <button
        type="button"
        className={`text-bold12 mb-[20px] mt-[12px] w-full rounded-[24px] bg-error py-[21px] text-center text-white ${selectedReportItem ? 'bg-error' : 'bg-gray0'}`}
        disabled={!selectedReportItem}
        onClick={handleReportButtonClick}
      >
        신고
      </button>
    </div>
  );
}

export default UserReportBottomSheet;
