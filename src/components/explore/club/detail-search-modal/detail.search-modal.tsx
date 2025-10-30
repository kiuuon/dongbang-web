import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/lib/apis/sign-up';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import filtersStore from '@/stores/filter-store';
import AffiliationSection from './affiliation-section';
import CategorySection from './category-section';

function DetailSearchModal({
  setIsDetailSearchModalOpen,
}: {
  setIsDetailSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [tab, setTab] = useState('소속');
  const { reset, apply, discard, draftFilters } = filtersStore();

  const { data: universityList } = useQuery({
    queryKey: ['universityList'],
    queryFn: fetchUniversityList,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.UNIVERSITY.LIST_FETCH_FAILED),
  });

  useEffect(() => {
    discard();
  }, [discard]);

  return (
    <div className="flex w-full flex-col rounded-t-[24px] bg-background">
      <div className="text-bold16 mb-[23px] mt-[38px] flex w-full items-center justify-center">상세 설정</div>
      <div className="flex h-[550px] max-h-[calc(100dvh-280px)] w-full flex-row">
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
        </div>
        <div className="h-full w-full overflow-y-auto bg-white">
          {tab === '소속' && <AffiliationSection />}
          {tab === '분야' && <CategorySection />}
        </div>
      </div>

      <div className="flex h-[94px] w-full items-center justify-center gap-[48px] bg-white">
        <button
          type="button"
          className="text-bold16 flex h-[45px] w-[101px] items-center justify-center"
          onClick={reset}
        >
          전체 초기화
        </button>
        <button
          type="button"
          className="text-bold16 flex h-[45px] w-[173px] items-center justify-center rounded-[15px] bg-primary text-white"
          onClick={() => {
            if (!universityList?.some((u) => u.name === draftFilters.universityName)) {
              draftFilters.universityName = null;
            }
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
