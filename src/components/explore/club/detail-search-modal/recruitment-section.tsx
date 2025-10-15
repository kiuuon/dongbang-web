import { useState } from 'react';

import filtersStore from '@/stores/filter-store';
import BottomArrowIcon3 from '@/icons/bottom-arrow-icon3';

type EndDateOption = 'D-Day' | '7일 이내' | '15일 이내' | '30일 이내' | '장기 모집' | null;
const END_DATES = ['D-Day', '7일 이내', '15일 이내', '30일 이내', '장기 모집'] as EndDateOption[];

function RecruitmentSection() {
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isEndDateDropdownOpen, setIsEndDateDropdownOpen] = useState(false);

  const { draftFilters, draftPatch, draftToggle } = filtersStore();

  return (
    <div className="flex w-full flex-col gap-[16px] pl-[30px] pt-[30px]">
      <div>
        <div className="text-bold14 mb-[10px]">모집 상태</div>
        <button
          type="button"
          className="text-regular12 flex h-[32px] w-[162px] items-center justify-between rounded-[8px] border border-gray0 pl-[8px] pr-[14px]"
          onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
        >
          {draftFilters.recruitmentStatuses?.length === 0 && '전체'}
          {(draftFilters.recruitmentStatuses?.length as number) < 3 &&
            (draftFilters.recruitmentStatuses?.includes('open') ||
              draftFilters.recruitmentStatuses?.includes('always')) &&
            '모집중'}
          {draftFilters.recruitmentStatuses?.length === 1 &&
            draftFilters.recruitmentStatuses[0] === 'closed' &&
            '모집 완료'}
          <BottomArrowIcon3 />
        </button>
        {isStateDropdownOpen && (
          <div className="text-regular12 scrollbar-hide absolute z-10 mt-[4px] max-h-[224px] w-[162px] overflow-y-scroll rounded-[8px] border border-gray0 bg-white">
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                draftToggle('recruitmentStatuses', '__CLEAR__');
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              전체
            </button>
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                if (!draftFilters.recruitmentStatuses?.includes('open')) {
                  draftToggle('recruitmentStatuses', 'open');
                }
                if (!draftFilters.recruitmentStatuses?.includes('always')) {
                  draftToggle('recruitmentStatuses', 'always');
                }
                if (draftFilters.recruitmentStatuses?.includes('closed')) {
                  draftToggle('recruitmentStatuses', 'closed');
                }
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              모집중
            </button>
            <button
              type="button"
              className="w-full p-[8px] text-start"
              onClick={() => {
                if (draftFilters.recruitmentStatuses?.includes('open')) {
                  draftToggle('recruitmentStatuses', 'open');
                }
                if (draftFilters.recruitmentStatuses?.includes('always')) {
                  draftToggle('recruitmentStatuses', 'always');
                }
                if (!draftFilters.recruitmentStatuses?.includes('closed')) {
                  draftToggle('recruitmentStatuses', 'closed');
                }
                draftPatch('endDateOption', null);
                setIsStateDropdownOpen(false);
              }}
            >
              모집 완료
            </button>
          </div>
        )}
      </div>

      {(draftFilters.recruitmentStatuses?.length as number) < 3 &&
        (draftFilters.recruitmentStatuses?.includes('open') ||
          draftFilters.recruitmentStatuses?.includes('always')) && (
          <div>
            <div className="text-bold14 mb-[10px]">마감일</div>
            <button
              type="button"
              className="text-regular12 flex h-[32px] w-[162px] items-center justify-between rounded-[8px] border border-gray0 pl-[8px] pr-[14px]"
              onClick={() => setIsEndDateDropdownOpen(!isEndDateDropdownOpen)}
            >
              {draftFilters.recruitmentStatuses?.includes('open') &&
                draftFilters.recruitmentStatuses?.includes('always') &&
                '전체'}
              {draftFilters.recruitmentStatuses?.includes('open') &&
                !draftFilters.recruitmentStatuses?.includes('always') &&
                draftFilters.endDateOption}
              {!draftFilters.recruitmentStatuses?.includes('open') &&
                draftFilters.recruitmentStatuses?.includes('always') &&
                '상시 모집'}

              <BottomArrowIcon3 />
            </button>
            {isEndDateDropdownOpen && (
              <div className="text-regular12 absolute z-10 mt-[4px] max-h-[240px] w-[162px] rounded-[8px] border border-gray0 bg-white">
                <button
                  type="button"
                  className="w-full p-[8px] text-start"
                  onClick={() => {
                    if (!draftFilters.recruitmentStatuses?.includes('open')) {
                      draftToggle('recruitmentStatuses', 'open');
                    }
                    if (!draftFilters.recruitmentStatuses?.includes('always')) {
                      draftToggle('recruitmentStatuses', 'always');
                    }
                    setIsEndDateDropdownOpen(false);
                  }}
                >
                  전체
                </button>
                {END_DATES.map((endDate) => (
                  <button
                    key={endDate}
                    type="button"
                    className="w-full p-[8px] text-start"
                    onClick={() => {
                      if (!draftFilters.recruitmentStatuses?.includes('open')) {
                        draftToggle('recruitmentStatuses', 'open');
                      }
                      if (draftFilters.recruitmentStatuses?.includes('always')) {
                        draftToggle('recruitmentStatuses', 'always');
                      }
                      draftPatch('endDateOption', endDate);
                      setIsEndDateDropdownOpen(false);
                    }}
                  >
                    {endDate}
                  </button>
                ))}
                <button
                  type="button"
                  className="w-full p-[8px] text-start"
                  onClick={() => {
                    if (draftFilters.recruitmentStatuses?.includes('open')) {
                      draftToggle('recruitmentStatuses', 'open');
                    }
                    if (!draftFilters.recruitmentStatuses?.includes('always')) {
                      draftToggle('recruitmentStatuses', 'always');
                    }
                    setIsEndDateDropdownOpen(false);
                  }}
                >
                  상시 모집
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

export default RecruitmentSection;
