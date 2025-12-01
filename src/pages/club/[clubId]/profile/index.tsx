import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUser } from '@/lib/apis/user';
import { fetchClubNickname, updateClubNickname } from '@/lib/apis/club/club';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function ClubMemberProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clubId } = router.query;
  const [nickname, setNickname] = useState('');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.INFO_FETCH_FAILED),
  });

  const { data: clubNickname } = useQuery({
    queryKey: ['clubNickname', clubId],
    queryFn: () => fetchClubNickname(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.NICKNAME_FETCH_FAILED),
  });

  const { mutate: handleUpdateClubNickname } = useMutation({
    mutationFn: () => updateClubNickname(clubId as string, nickname === '' ? user?.name : nickname),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubNickname', clubId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.UPDATE_NICKNAME_FAILED),
  });

  useEffect(() => {
    if (clubNickname) {
      setNickname(clubNickname);
    }
  }, [clubNickname]);

  const handleSave = () => {
    if (clubNickname === nickname || (nickname === '' && clubNickname === user?.name)) return;
    handleUpdateClubNickname();
  };

  return (
    <div className="flex h-screen flex-col justify-between px-[20px] pt-[68px]">
      <Header>
        <div className="flex flex-row items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">활동명 변경</div>
        </div>
      </Header>
      <div className="flex flex-col gap-[10px]">
        <div className="text-bold12 user-select-none">동아리 활동명</div>
        <input
          type="text"
          className="text-regular14 w-full rounded-[8px] border border-gray0 p-[16px] placeholder:text-gray2"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder={user?.name}
        />
        <div className="text-regular12 text-primary user-select-none">동아리 내부에서 표시되는 이름입니다</div>
      </div>
      <button
        type="button"
        className={`text-bold16 mb-[20px] mt-[20px] flex h-[56px] min-h-[56px] w-full items-center justify-center rounded-[24px] ${clubNickname === nickname || (nickname === '' && clubNickname === user?.name) ? 'bg-gray0' : 'bg-primary'} text-white`}
        onClick={handleSave}
      >
        저장
      </button>
    </div>
  );
}

export default ClubMemberProfile;
