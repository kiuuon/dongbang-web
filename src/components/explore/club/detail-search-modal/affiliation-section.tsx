import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import filtersStore from '@/stores/filter-store';
import { fetchUniversityList } from '@/lib/apis/sign-up';
import BottomArrowIcon3 from '@/icons/bottom-arrow-icon3';

const LOCATIONS = [
  '전국',
  '서울',
  '경기',
  '인천',
  '강원',
  '충북',
  '충남',
  '대전',
  '세종',
  '전북',
  '전남',
  '광주',
  '경북',
  '경남',
  '대구',
  '부산',
  '울산',
  '제주',
];

function AffiliationSection() {
  const [searchedUniversityList, setSearchedUniversityList] = useState<Array<{ id: number; name: string }>>([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const { draftFilters, draftPatch, draftToggle } = filtersStore();

  const { data: universityList } = useQuery({
    queryKey: ['universityList'],
    queryFn: fetchUniversityList,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '대학 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`대학 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const handleUniversity = (event: React.ChangeEvent<HTMLInputElement>) => {
    draftPatch('universityName', event.target.value);

    if (!universityList) return;

    if (event.target.value === '') {
      setSearchedUniversityList([]);
    } else {
      const searchedList = universityList.filter((item) => item.name.includes(event.target.value));
      setSearchedUniversityList(searchedList as Array<{ id: number; name: string }>);
    }
  };

  return (
    <div className="flex w-full flex-col gap-[16px] pl-[30px] pt-[30px]">
      <div>
        <div className="text-bold14 mb-[16px]">유형</div>
        <div className="flex gap-[16px]">
          <button
            type="button"
            className={`${draftFilters.clubType === 'campus' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[47px] items-center justify-center rounded-[16px]`}
            onClick={() => {
              if (draftFilters.clubType === 'campus') {
                draftPatch('clubType', null);
                draftPatch('universityName', null);
                setSearchedUniversityList([]);
                draftToggle('detailTypes', '__CLEAR__');
                return;
              }
              draftPatch('clubType', 'campus');
              draftPatch('location', null);
            }}
          >
            교내
          </button>
          <button
            type="button"
            className={`${draftFilters.clubType === 'union' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[47px] items-center justify-center rounded-[16px]`}
            onClick={() => {
              if (draftFilters.clubType === 'union') {
                draftPatch('clubType', null);
                draftPatch('location', null);
                return;
              }
              draftPatch('clubType', 'union');
              draftPatch('universityName', null);
              setSearchedUniversityList([]);
              draftToggle('detailTypes', '__CLEAR__');
            }}
          >
            연합
          </button>
        </div>
      </div>

      {draftFilters.clubType === 'campus' && (
        <div>
          <div className="text-bold14 mb-[10px]">소속대학</div>
          <input
            type="text"
            className="text-regular12 flex h-[32px] w-[162px] items-center justify-start rounded-[8px] border border-gray0 px-[9px] outline-none"
            value={draftFilters.universityName || ''}
            onChange={handleUniversity}
          />
          {searchedUniversityList.length > 0 && (
            <div className="text-regular12 scrollbar-hide absolute z-10 mt-[4px] max-h-[224px] w-[162px] overflow-y-scroll rounded-[8px] border border-gray0 bg-white">
              {searchedUniversityList.map((university) => (
                <button
                  type="button"
                  className="w-full p-[8px] text-start"
                  onClick={() => {
                    draftPatch('universityName', university.name);
                    setSearchedUniversityList([]);
                  }}
                >
                  {university.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {draftFilters.clubType === 'campus' && (
        <div className="flex flex-col gap-[16px]">
          <div className="text-bold14">종류</div>
          <div className="flex gap-[16px]">
            <button
              type="button"
              className={`${draftFilters.detailTypes?.includes('총 동아리') ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[71px] items-center justify-center rounded-[24px]`}
              onClick={() => draftToggle('detailTypes', '총 동아리')}
            >
              총 동아리
            </button>
            <button
              type="button"
              className={`${draftFilters.detailTypes?.includes('중앙 동아리') ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[81px] items-center justify-center rounded-[24px]`}
              onClick={() => draftToggle('detailTypes', '중앙 동아리')}
            >
              중앙 동아리
            </button>
          </div>
          <div className="flex gap-[7px]">
            <button
              type="button"
              className={`${draftFilters.detailTypes?.includes('단과대 동아리') ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[92px] items-center justify-center rounded-[24px]`}
              onClick={() => draftToggle('detailTypes', '단과대 동아리')}
            >
              단과대 동아리
            </button>
            <button
              type="button"
              className={`${draftFilters.detailTypes?.includes('과 동아리') ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[71px] items-center justify-center rounded-[24px]`}
              onClick={() => draftToggle('detailTypes', '과 동아리')}
            >
              과 동아리
            </button>
          </div>
          <div>
            <button
              type="button"
              className={`${draftFilters.detailTypes?.includes('소모임') ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'} flex h-[32px] w-[58px] items-center justify-center rounded-[24px]`}
              onClick={() => draftToggle('detailTypes', '소모임')}
            >
              소모임
            </button>
          </div>
        </div>
      )}

      {draftFilters.clubType === 'union' && (
        <div>
          <div className="text-bold14 mb-[10px]">활동위치</div>
          <button
            type="button"
            className="text-regular12 flex h-[32px] w-[162px] items-center justify-between rounded-[8px] border border-gray0 pl-[8px] pr-[14px]"
            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
          >
            {draftFilters.location || '전체'}
            <BottomArrowIcon3 />
          </button>
          {isLocationDropdownOpen && (
            <div className="text-regular12 scrollbar-hide absolute z-10 mt-[4px] max-h-[224px] w-[162px] overflow-y-scroll rounded-[8px] border border-gray0 bg-white">
              <button
                type="button"
                className="w-full p-[8px] text-start"
                onClick={() => {
                  draftPatch('location', null);
                  setIsLocationDropdownOpen(false);
                }}
              >
                전체
              </button>
              {LOCATIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="w-full p-[8px] text-start"
                  onClick={() => {
                    draftPatch('location', item);
                    setIsLocationDropdownOpen(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AffiliationSection;
