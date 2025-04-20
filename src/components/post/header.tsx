import { useState } from 'react';
import { useRouter } from 'next/router';

import BottomArrowIcon from '@/icons/bottom-arrow-icon';
import RightArrowIcon from '@/icons/right-arrow-icon';
import BellIcon from '@/icons/bell-icon';
import MessageIcon from '@/icons/message-icon';

function Header() {
  const router = useRouter();
  const { clubType } = router.query;
  const clubTypeName = {
    my: '내 동아리',
    campus: '교내 동아리',
    union: '연합 동아리',
  }[clubType as string];
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const goToSelectedClubType = (selectedClubType: string) => {
    router.push(`/post/${selectedClubType}`);
    setIsNavigationOpen(false);
  };

  return (
    <header className="mt-[12px] flex h-[36px] w-full items-center justify-between bg-white pl-[20px]">
      <div className="flex items-center gap-[8px]">
        <button
          type="button"
          className="flex cursor-pointer items-center"
          onClick={() => setIsNavigationOpen((prev) => !prev)}
        >
          <div className="text-regular24 text-tertiary_light">{clubTypeName}</div>
          {isNavigationOpen ? <RightArrowIcon /> : <BottomArrowIcon />}
        </button>
        {isNavigationOpen && (
          <div className="flex items-center gap-[12px]">
            {clubType !== 'my' && (
              <button
                type="button"
                className="text-regular24 cursor-pointer text-gray1"
                onClick={() => goToSelectedClubType('my')}
              >
                내 동아리
              </button>
            )}
            {clubType !== 'campus' && (
              <button
                type="button"
                className="text-regular24 cursor-pointer text-gray1"
                onClick={() => goToSelectedClubType('campus')}
              >
                교내 동아리
              </button>
            )}
            {clubType !== 'union' && (
              <button
                type="button"
                className="text-regular24 cursor-pointer text-gray1"
                onClick={() => goToSelectedClubType('union')}
              >
                연합 동아리
              </button>
            )}
          </div>
        )}
      </div>
      {!isNavigationOpen && (
        <div className="mr-[20px] flex items-center gap-[25px]">
          <button type="button">
            <BellIcon />
          </button>
          <button type="button">
            <MessageIcon />
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
