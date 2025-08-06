import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import { fetchAllClubs } from '@/lib/apis/club';

function ClubTagModal({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [searchText, setSearchText] = useState('');

  const { data: clubs } = useQuery({
    queryKey: ['allClubs'],
    queryFn: () => fetchAllClubs(),
    throwOnError: (error) => {
      alert(`클럽 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const selectClub = (selectedClubId: string) => {
    setSelected((prev) =>
      prev.includes(selectedClubId) ? prev.filter((id) => id !== selectedClubId) : [...prev, selectedClubId],
    );
  };

  const filteredClubs = clubs?.filter((club) => club.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="w-full">
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="검색"
        className="text-regular16 mb-[20px] mt-[23px] h-[40px] w-full rounded-[10px] bg-gray0 px-[13px] placeholder:text-gray2"
      />
      <div className="scrollbar-hide flex h-[140px] w-full flex-col gap-[10px] overflow-y-scroll">
        {filteredClubs?.map((club) => (
          <div key={club.id} className="flex h-[40px] min-h-[40px] w-full items-center justify-between">
            <Image
              src={club.logo}
              alt="로고"
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '5px',
                border: '1px solid #F9F9F9',
              }}
            />
            <button
              type="button"
              aria-label="클럽 선택"
              className="ml-[29px] flex w-full items-center justify-between"
              onClick={() => selectClub(club.id)}
            >
              <span className="text-bold12">{club.name}</span>
              <div
                className={`h-[20px] w-[20px] rounded-full ${selected.includes(club.id) ? 'bg-primary' : 'border border-gray2 bg-white'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClubTagModal;
