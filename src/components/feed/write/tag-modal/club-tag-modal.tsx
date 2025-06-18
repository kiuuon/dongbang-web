import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { fetchAllClubs } from '@/lib/apis/club';
import ToggleIcon2 from '@/icons/toggle-icon2';

function ClubTagModal({
  selectedClubs,
  setSelectedClubs,
  bottomSheetCloseRef,
}: {
  selectedClubs: string[];
  setSelectedClubs: React.Dispatch<React.SetStateAction<string[]>>;
  bottomSheetCloseRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [selected, setSelected] = useState<string[]>(selectedClubs);
  const [searchText, setSearchText] = useState('');

  const { data: clubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => fetchAllClubs(),
  });

  const selectAllClubs = () => {
    if (selected.length === clubs?.length) {
      setSelected([]);
    } else {
      setSelected(clubs?.map((club) => club.id) || []);
    }
  };

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  const handleConfirm = () => {
    setSelectedClubs(selected);
    bottomSheetCloseRef.current?.();
  };

  const filteredClubs = clubs?.filter((club) => club.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="w-full">
      <div className="mb-[4px] flex w-full items-center justify-end gap-[8px]">
        <span>전체</span>
        <button type="button" onClick={selectAllClubs}>
          <ToggleIcon2 active={selected.length === clubs?.length} />
        </button>
      </div>
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="검색"
        className="text-regular16 mb-[20px] h-[40px] w-full rounded-[10px] bg-gray0 px-[13px] placeholder:text-gray2"
      />
      <div className="scrollbar-hide flex h-[140px] w-full flex-col gap-[10px] overflow-y-scroll">
        {filteredClubs?.map((club) => (
          <div key={club.id} className="flex h-[40px] min-h-[40px] w-full items-center justify-between">
            <div className="flex items-center gap-[29px]">
              <Image
                src={club.logo}
                alt="로고"
                width={40}
                height={40}
                style={{
                  objectFit: 'cover',
                  width: '40px',
                  height: '40px',
                  borderRadius: '5px',
                  border: '1px solid #F9F9F9',
                }}
              />
              <span className="text-bold12">{club.name}</span>
            </div>
            <button
              type="button"
              aria-label="클럽 선택"
              className={`h-[20px] w-[20px] rounded-full ${selected.includes(club.id) ? 'bg-primary' : 'border border-gray2 bg-white'}`}
              onClick={() => selectClub(club.id)}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-bold16 my-[20px] h-[56px] w-full rounded-[24px] bg-primary text-white"
        onClick={handleConfirm}
      >
        확인
      </button>
    </div>
  );
}

export default ClubTagModal;
