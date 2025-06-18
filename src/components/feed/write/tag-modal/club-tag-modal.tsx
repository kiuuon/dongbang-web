import { useRef, useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { fetchAllClubs } from '@/lib/apis/club';

function useScrollEnd(callback: () => void, delay = 150) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onScroll = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  };

  return onScroll;
}

function ClubTagModal({
  selected,
  setSelected,
  setDragEnabled,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setDragEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchText, setSearchText] = useState('');

  const { data: clubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => fetchAllClubs(),
  });

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  const filteredClubs = clubs?.filter((club) => club.name?.toLowerCase().includes(searchText.toLowerCase()));

  const handleScrollEnd = () => {
    setDragEnabled(true);
  };

  const onScroll = useScrollEnd(handleScrollEnd);

  return (
    <div className="w-full">
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="검색"
        className="text-regular16 mb-[20px] mt-[28px] h-[40px] w-full rounded-[10px] bg-gray0 px-[13px] placeholder:text-gray2"
      />
      <div className="scrollbar-hide flex h-[140px] w-full flex-col gap-[10px] overflow-y-scroll" onScroll={onScroll}>
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
    </div>
  );
}

export default ClubTagModal;
