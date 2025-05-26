import RightArrowIcon4 from '@/icons/right-arrow-icon4';

function AnnouncementButton() {
  return (
    <button
      type="button"
      className="mb-[19px] mt-[12px] flex h-[40px] w-full flex-row items-center justify-between rounded-[8px] bg-secondary pl-[38px] pr-[16px]"
    >
      <div className="text-bold12">공지</div>
      <RightArrowIcon4 />
    </button>
  );
}

export default AnnouncementButton;
