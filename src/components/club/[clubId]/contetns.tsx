import { useRouter } from 'next/router';

import FileIcon from '@/icons/file-icon';
import CalendarIcon from '@/icons/calendar-icon';
import DocumentIcon from '@/icons/document-icon';
import StatsIcon from '@/icons/stats-icon';
import MissionIcon from '@/icons/mission-icon';

function Contents() {
  const router = useRouter();

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('comingSoon');
      return;
    }
    router.push('/coming-soon');
  };

  return (
    <div className="flex flex-row items-center justify-between px-[16px]">
      <button type="button" className="flex flex-col items-center gap-[8px]" onClick={goToCommingSoon}>
        <FileIcon />
        <div className="text-regular12">파일</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]" onClick={goToCommingSoon}>
        <CalendarIcon />
        <div className="text-regular12">캘린더</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]" onClick={goToCommingSoon}>
        <DocumentIcon />
        <div className="text-regular12">회비내역</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]" onClick={goToCommingSoon}>
        <StatsIcon />
        <div className="text-regular12">통계</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]" onClick={goToCommingSoon}>
        <MissionIcon />
        <div className="text-regular12">미션</div>
      </button>
    </div>
  );
}

export default Contents;
