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
  const [draftSelectedMembers, setDraftSelectedMembers] = useState<string[]>(selectedMembers);
  const [draftSelectedClubs, setDraftSelectedClubs] = useState<string[]>(selectedClubs);
  const [dragEnabled, setDragEnabled] = useState(true);

  const handleConfirm = () => {
    setSelectedMembers(draftSelectedMembers);
    setSelectedClubs(draftSelectedClubs);
    bottomSheetCloseRef.current?.();
  };

  return (
    <BottomSheet
      setIsBottomSheetOpen={setIsBottomSheetOpen}
      dragEnabled={dragEnabled}
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
          selected={draftSelectedClubs}
          setSelected={setDraftSelectedClubs}
          setDragEnabled={setDragEnabled}
        />
      ) : (
        <PersonTagModal
          selected={draftSelectedMembers}
          setSelected={setDraftSelectedMembers}
          setDragEnabled={setDragEnabled}
        />
      )}
      <button
        type="button"
        className="text-bold16 my-[20px] h-[56px] w-full rounded-[24px] bg-primary text-white"
        onClick={handleConfirm}
      >
        확인
      </button>
    </BottomSheet>
  );
}

export default TagModal;
