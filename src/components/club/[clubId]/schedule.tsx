import ScheduleIcon from '@/icons/schedule-icon';

function Schedule() {
  return (
    <div className="my-[20px] flex flex-col gap-[8px]">
      <h1 className="text-bold16 mb-[2px]">주요 일정</h1>
      <div className="flex items-center gap-[3px]">
        <div>
          <ScheduleIcon />
        </div>
        <div className="h-[52px] w-full rounded-[8px] border border-gray0 bg-white" />
      </div>
      <div className="flex items-center gap-[3px]">
        <div>
          <ScheduleIcon />
        </div>
        <div className="h-[52px] w-full rounded-[8px] border border-gray0 bg-white" />
      </div>
    </div>
  );
}

export default Schedule;
