import { useEffect, useState } from 'react';

import filtersStore from '@/stores/filter-store';
import AffiliationSection from './affiliation-section';
import CategorySection from './category-section';
import RecruitmentSection from './recruitment-section';

function DetailSearchModal({
  setIsDetailSearchModalOpen,
}: {
  setIsDetailSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tab, setTab] = useState('소속');
  const { reset, apply, discard } = filtersStore();

  useEffect(() => {
    discard();
  }, [discard]);

  return (
    <div className="flex w-full flex-col rounded-t-[24px] bg-background">
      <div className="text-bold16 mb-[23px] mt-[38px] flex w-full items-center justify-center">상세 설정</div>
      <div className="flex h-[550px] max-h-[calc(100vh-280px)] w-full flex-row">
        <div className="flex h-full w-[118px] min-w-[118px] flex-col bg-background">
          <button
            type="button"
            className={`${tab === '소속' ? 'bg-white text-black' : 'bg-background text-gray2'} text-bold16 flex h-[51px] items-center pl-[32px]`}
            onClick={() => setTab('소속')}
          >
            소속
          </button>
          <button
            type="button"
            className={`${tab === '분야' ? 'bg-white text-black' : 'bg-background text-gray2'} text-bold16 flex h-[51px] items-center pl-[32px]`}
            onClick={() => setTab('분야')}
          >
            분야
          </button>
          <button
            type="button"
            className={`${tab === '모집 설정' ? 'bg-white text-black' : 'bg-background text-gray2'} text-bold16 flex h-[51px] items-center pl-[32px]`}
            onClick={() => setTab('모집 설정')}
          >
            모집 설정
          </button>
        </div>
        <div className="h-full w-full overflow-y-auto bg-white">
          {tab === '소속' && <AffiliationSection />}
          {tab === '분야' && <CategorySection />}
          {tab === '모집 설정' && <RecruitmentSection />}
        </div>
      </div>

      <div className="flex h-[94px] w-full items-center gap-[48px] bg-white">
        <button
          type="button"
          className="text-bold16 ml-[44px] flex h-[45px] w-[101px] items-center justify-center"
          onClick={reset}
        >
          전체 초기화
        </button>
        <button
          type="button"
          className="text-bold16 flex h-[45px] w-[173px] items-center justify-center rounded-[15px] bg-primary text-white"
          onClick={() => {
            apply();
            setIsDetailSearchModalOpen(false);
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}

export default DetailSearchModal;
