import FileIcon from '@/icons/file-icon';
import CalendarIcon from '@/icons/calendar-icon';
import DocumentIcon from '@/icons/document-icon';
import StatsIcon from '@/icons/stats-icon';
import MissionIcon from '@/icons/mission-icon';

function Contents() {
  return (
    <div className="flex flex-row items-center justify-between px-[16px]">
      <button type="button" className="flex flex-col items-center gap-[8px]">
        <FileIcon />
        <div className="text-regular12">파일</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]">
        <CalendarIcon />
        <div className="text-regular12">캘린더</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]">
        <DocumentIcon />
        <div className="text-regular12">회비내역</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]">
        <StatsIcon />
        <div className="text-regular12">통계</div>
      </button>
      <button type="button" className="flex flex-col items-center gap-[8px]">
        <MissionIcon />
        <div className="text-regular12">미션</div>
      </button>
    </div>
  );
}

export default Contents;
