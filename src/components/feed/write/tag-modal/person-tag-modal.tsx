import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubMembers } from '@/lib/apis/club';
import ToggleIcon2 from '@/icons/toggle-icon2';

function PersonTagModal({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const router = useRouter();
  const { clubId } = router.query;
  const [searchText, setSearchText] = useState('');

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '동아리 멤버 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`동아리 멤버 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const selectAllMembers = () => {
    if (selected.length === members?.length) {
      setSelected([]);
    } else {
      setSelected(members?.map((member) => member.userId) || []);
    }
  };

  const selectMember = (userId: string) => {
    setSelected((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const filteredMembers = members?.filter((member) => member.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="w-full">
      <div className="mb-[4px] flex w-full items-center justify-end gap-[8px]">
        <span>전체</span>
        <button type="button" onClick={selectAllMembers}>
          <ToggleIcon2 active={selected.length === members?.length} />
        </button>
      </div>
      <input
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="검색"
        className="text-regular16 mb-[20px] h-[40px] w-full rounded-[10px] bg-gray0 px-[13px] placeholder:text-gray2"
      />
      <div className="scrollbar-hide flex h-[140px] w-full flex-col gap-[10px] overflow-y-scroll">
        {filteredMembers?.map((member) => (
          <button
            type="button"
            key={member.userId}
            className="flex h-[40px] min-h-[40px] w-full items-center justify-between"
            onClick={() => selectMember(member.userId)}
          >
            <div className="flex items-center gap-[29px]">
              {member.avatar ? '' : <div className="h-[40px] w-[40px] rounded-full bg-black" />}
              <span className="text-bold12">{member.name}</span>
            </div>
            <div
              className={`h-[20px] w-[20px] rounded-full ${selected.includes(member.userId) ? 'bg-primary' : 'border border-gray2 bg-white'}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default PersonTagModal;
