import InteractIcon2 from '@/icons/interact-icon2';
import LockIcon from '@/icons/lock-icon';

function InteractModal() {
  return (
    <div className="flex w-full flex-col items-center px-[20px]">
      <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1" />
      <div className="flex w-full flex-col">
        <button
          type="button"
          className="text-bold16 flex h-[66px] w-full items-center gap-[12px] border-b border-b-gray0"
          onClick={() => {}}
        >
          <InteractIcon2 />
          교류 신청
        </button>

        <button
          type="button"
          className="text-bold16 flex h-[66px] w-full items-center gap-[12px] border-b border-b-gray0 text-gray1"
          onClick={() => {}}
        >
          <LockIcon />
          지원하기
        </button>
      </div>
    </div>
  );
}

export default InteractModal;
