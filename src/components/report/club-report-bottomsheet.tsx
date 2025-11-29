import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { report } from '@/lib/apis/report';
import { ERROR_MESSAGE } from '@/lib/constants';
import { handleMutationError } from '@/lib/utils';

const REPORT_ITEMS = {
  falseInformation: '동아리 소개 내용이 사실과 다릅니다',
  illegal: '불법/위험 활동이 의심됩니다',
  discrimination: '특정 인물/집단에 대한 혐오/차별을 조장합니다',
};

function ClubReportBottomSheet({ clubId, onClose }: { clubId: string; onClose: () => void }) {
  const [selectedReportItem, setSelectedReportItem] = useState<keyof typeof REPORT_ITEMS | null>(null);

  const { mutate: handleReport } = useMutation({
    mutationFn: () => report('club', clubId, REPORT_ITEMS[selectedReportItem as keyof typeof REPORT_ITEMS]),
    onSuccess: () => {
      onClose();
      toast.success('동아리 신고가 접수되었습니다.');
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

  return (
    <div className="flex w-full flex-col items-center px-[24px]">
      <div className="mb-[12px] mt-[12px] h-[2px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="text-bold14 mb-[24px]">신고</div>
      <div className="text-regular12 mb-[16px] text-gray1">
        이 동아리를 신고하는 이유를 알려주세요. 신고 내용은 동방 운영팀이 검토하며 , 익명으로 처리됩니다.
      </div>
      <div className="flex w-full flex-col gap-[8px]">
        <button
          type="button"
          className={`flex h-[56px] w-full items-center justify-between gap-[8px] rounded-[8px] border border-gray0 pl-[24px] pr-[17px] ${selectedReportItem === 'falseInformation' ? 'bg-background' : 'bg-white'}`}
          onClick={() => setSelectedReportItem('falseInformation')}
        >
          {REPORT_ITEMS.falseInformation}
          <div
            className={`${selectedReportItem === 'falseInformation' ? 'bg-black' : 'border border-gray0 bg-white'} h-[20px] w-[20px] rounded-full`}
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
          className={`flex h-[56px] w-full items-center justify-between gap-[8px] rounded-[8px] border border-gray0 pl-[24px] pr-[17px] ${selectedReportItem === 'discrimination' ? 'bg-background' : 'bg-white'}`}
          onClick={() => setSelectedReportItem('discrimination')}
        >
          {REPORT_ITEMS.discrimination}
          <div
            className={`${selectedReportItem === 'discrimination' ? 'bg-black' : 'border border-gray0 bg-white'} h-[20px] w-[20px] rounded-full`}
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

export default ClubReportBottomSheet;
