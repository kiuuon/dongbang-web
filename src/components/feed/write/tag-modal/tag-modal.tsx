import { useRef, useState } from 'react';

import BottomSheet from '@/components/common/bottom-sheet';
import PersonTagModal from './person-tag-modal';
import ClubTagModal from './club-tag-modal';

function TagModal({
  setIsBottomSheetOpen,
  selectedMembers,
  setSelectedMembers,
  selectedClubs,
  setSelectedClubs,
}: {
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMembers: string[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;
  selectedClubs: string[];
  setSelectedClubs: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isClub, setIsClub] = useState(false);

  return (
    <BottomSheet
      setIsBottomSheetOpen={setIsBottomSheetOpen}
      onRequestClose={(closeFn) => {
        bottomSheetCloseRef.current = closeFn;
      }}
    >
      <div className="mb-[2px] mt-[40px] flex w-full gap-[12px]">
        <button
          type="button"
          className={`h-[36px] w-[79px] rounded-[8px] ${isClub ? 'text-regular16 bg-gray0 text-black' : 'text-bold16 bg-primary text-white'}`}
          onClick={() => setIsClub(false)}
        >
          개인
        </button>
        <button
          type="button"
          className={`h-[36px] w-[79px] rounded-[8px] ${isClub ? 'text-bold16 bg-primary text-white' : 'text-regular16 bg-gray0 text-black'}`}
          onClick={() => setIsClub(true)}
        >
          동아리
        </button>
      </div>
      {isClub ? (
        <ClubTagModal
          selectedClubs={selectedClubs}
          setSelectedClubs={setSelectedClubs}
          bottomSheetCloseRef={bottomSheetCloseRef}
        />
      ) : (
        <PersonTagModal
          selectedMembers={selectedMembers}
          setSelectedMembers={setSelectedMembers}
          bottomSheetCloseRef={bottomSheetCloseRef}
        />
      )}
    </BottomSheet>
  );
}

export default TagModal;
