import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchClubMembers } from '@/lib/apis/club/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import MemberList from './member-list';

function MemberBoard() {
  const router = useRouter();
  const { clubId } = router.query;

  const [selectedRole, setSelectedRole] = useState('all');
  const [inputValue, setInputValue] = useState('');

  const { data: members } = useQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => fetchClubMembers(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.MEMBERS_FETCH_FAILED),
  });

  const presidents = members?.filter((member) => member.role === 'president');
  const officers = members?.filter((member) => member.role === 'officer');
  const regulars = members?.filter((member) => member.role === 'member');
  const onLeave = members?.filter((member) => member.role === 'on_leave');
  const graduates = members?.filter((member) => member.role === 'graduate');

  const getVisibleRoles = () => {
    if (selectedRole === 'president') {
      return presidents?.filter(
        (president) =>
          president.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          president.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    if (selectedRole === 'officer') {
      return officers?.filter(
        (officer) =>
          officer.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          officer.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    if (selectedRole === 'member') {
      return regulars?.filter(
        (regular) =>
          regular.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          regular.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    if (selectedRole === 'onLeave') {
      return onLeave?.filter(
        (o) =>
          o.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          o.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    if (selectedRole === 'graduate') {
      return graduates?.filter(
        (graduate) =>
          graduate.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          graduate.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      );
    }

    return [
      ...(presidents?.filter(
        (president) =>
          president.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          president.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      ) || []),
      ...(officers?.filter(
        (officer) =>
          officer.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          officer.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      ) || []),
      ...(regulars?.filter(
        (regular) =>
          regular.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          regular.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      ) || []),
      ...(onLeave?.filter(
        (o) =>
          o.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          o.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      ) || []),
      ...(graduates?.filter(
        (graduate) =>
          graduate.name?.toLowerCase().includes(inputValue.toLowerCase()) ||
          graduate.nickname?.toLowerCase().includes(inputValue.toLowerCase()),
      ) || []),
    ];
  };

  const visibleRoles = getVisibleRoles();

  return (
    <div>
      <div className="text-regular14 text-gray2">역할</div>
      <div className="scrollbar-hide mt-[6px] flex gap-[12px] overflow-x-auto">
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'all' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('all');
          }}
        >
          전체({members?.length})
        </button>
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'president' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('president');
          }}
        >
          회장({presidents?.length})
        </button>
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'officer' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('officer');
          }}
        >
          임원({officers?.length})
        </button>
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'member' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('member');
          }}
        >
          부원({regulars?.length})
        </button>
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'onLeave' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('onLeave');
          }}
        >
          휴학생({onLeave?.length})
        </button>
        <button
          type="button"
          className={`whitespace-nowrap rounded-[24px] px-[13px] py-[9px] ${selectedRole === 'graduate' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'}`}
          onClick={() => {
            setSelectedRole('graduate');
          }}
        >
          졸업생({graduates?.length})
        </button>
      </div>
      <input
        value={inputValue}
        placeholder="검색"
        className="text-regular16 my-[20px] w-full rounded-[10px] bg-gray0 px-[12px] py-[10px] outline-none placeholder:text-gray2"
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
      {visibleRoles && visibleRoles.length > 0 && <MemberList members={visibleRoles || []} />}
    </div>
  );
}

export default MemberBoard;
