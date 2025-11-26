import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { fetchUserProfileVisibility, updateUserProfileVisibility } from '@/lib/apis/user';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import ToggleIcon from '@/icons/toggle-icon';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function ProfileVisibilityPage() {
  const queryClient = useQueryClient();

  const [showUniversity, setShowUniversity] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [showClubs, setShowClubs] = useState(false);
  const [isSame, setIsSame] = useState(false);

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data: profileVisibility } = useQuery({
    queryKey: ['userProfileVisibility', userId],
    queryFn: () => fetchUserProfileVisibility(userId as string),
    enabled: !!userId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.PROFILE_VISIBILITY_FETCH_FAILED),
  });

  const { mutate: handleUpdateProfileVisibility } = useMutation({
    mutationFn: () =>
      updateUserProfileVisibility({
        show_university: showUniversity,
        show_clubs: showClubs,
        show_feed: showFeed,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfileVisibility', userId] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.USER.PROFILE_VISIBILITY_UPDATE_FAILED),
  });

  useEffect(() => {
    if (profileVisibility) {
      setShowUniversity(profileVisibility.show_university);
      setShowClubs(profileVisibility.show_clubs);
      setShowFeed(profileVisibility.show_feed);
    }
  }, [profileVisibility]);

  useEffect(() => {
    if (profileVisibility) {
      setIsSame(
        showUniversity === profileVisibility.show_university &&
          showClubs === profileVisibility.show_clubs &&
          showFeed === profileVisibility.show_feed,
      );
    }
  }, [profileVisibility, showUniversity, showClubs, showFeed]);

  const handleSave = () => {
    if (isSame) {
      return;
    }

    handleUpdateProfileVisibility();
  };

  return (
    <div className="h-screen px-[20px] pt-[61px]">
      <Header>
        <div className="flex items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">프로필 공개 범위 설정</div>
        </div>
        <button
          type="button"
          className={`text-regular14 mr-[12px] ${isSame ? 'text-gray1' : 'text-black'}`}
          onClick={() => handleSave()}
        >
          저장
        </button>
      </Header>
      <div className="text-regular12 text-gray1">프로필 조회 시 아래 항목을 숨길 수 있어요.</div>

      <div className="mb-[12px] mt-[8px] flex flex-col rounded-[8px] border border-gray0">
        {/* 학교/학과 */}
        <div className="flex items-center justify-between border-b border-gray0 py-[16px] pl-[16px] pr-[13px]">
          <div className="flex flex-col items-start justify-center gap-[1px]">
            <div className="text-regular14">학교/학과</div>
            <div className="text-regular12 text-gray1">내 프로필에에서 학교/학과를 숨깁니다.</div>
          </div>
          <button type="button" onClick={() => setShowUniversity((prev) => !prev)}>
            <ToggleIcon active={showUniversity} />
          </button>
        </div>
        {/* 내 피드 */}
        <div className="flex items-center justify-between border-b border-gray0 py-[16px] pl-[16px] pr-[13px]">
          <div className="flex flex-col items-start justify-center gap-[1px]">
            <div className="text-regular14">내 피드</div>
            <div className="text-regular12 text-gray1">내 프로필에서 내 피드를 숨깁니다.</div>
          </div>
          <button type="button" onClick={() => setShowFeed((prev) => !prev)}>
            <ToggleIcon active={showFeed} />
          </button>
        </div>
        {/* 소속 동아리 */}
        <div className="flex items-center justify-between py-[16px] pl-[16px] pr-[13px]">
          <div className="flex flex-col items-start justify-center gap-[1px]">
            <div className="text-regular14">소속 동아리</div>
            <div className="text-regular12 text-gray1">내 프로필에서 소속 동아리를 숨깁니다.</div>
          </div>
          <button type="button" onClick={() => setShowClubs((prev) => !prev)}>
            <ToggleIcon active={showClubs} />
          </button>
        </div>
      </div>
      <div className="text-regular12 ml-[4px] text-primary">프로필 이외 페이지에서는 숨겨지지 않습니다.</div>
    </div>
  );
}

export default ProfileVisibilityPage;
