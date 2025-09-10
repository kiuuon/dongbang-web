import { useState } from 'react';

import {
  SPORTS_CATEGORIES,
  ART_CATEGORIES,
  HOBBY_CATEGORIES,
  SOCIETY_CATEGORIES,
  ACADEMIC_CATEGORIES,
} from '@/lib/constants';
import filtersStore from '@/stores/filter-store';

function CategorySection() {
  const [selectedTopCategory, setSelectedTopCategory] = useState('');
  const { draftFilters, toggle } = filtersStore();

  return (
    <div className="pl-[30px] pt-[30px]">
      <div className="text-bold14 mb-[16px]">카테고리</div>

      <div className="mb-[8px] flex gap-[13px]">
        <button
          type="button"
          className={`${selectedTopCategory === '운동' ? 'bg-white' : 'bg-gray0'} text-regular14 flex h-[31px] w-[63px] items-center justify-center rounded-[5px] text-gray2`}
          onClick={() => {
            if (selectedTopCategory === '운동') {
              setSelectedTopCategory('');
            } else {
              setSelectedTopCategory('운동');
            }
          }}
        >
          운동
        </button>
        <button
          type="button"
          className={`${selectedTopCategory === '예술' ? 'bg-white' : 'bg-gray0'} text-regular14 flex h-[31px] w-[63px] items-center justify-center rounded-[5px] text-gray2`}
          onClick={() => {
            if (selectedTopCategory === '예술') {
              setSelectedTopCategory('');
            } else {
              setSelectedTopCategory('예술');
            }
          }}
        >
          예술
        </button>
        <button
          type="button"
          className={`${selectedTopCategory === '취미' ? 'bg-white' : 'bg-gray0'} text-regular14 flex h-[31px] w-[63px] items-center justify-center rounded-[5px] text-gray2`}
          onClick={() => {
            if (selectedTopCategory === '취미') {
              setSelectedTopCategory('');
            } else {
              setSelectedTopCategory('취미');
            }
          }}
        >
          취미
        </button>
      </div>

      {selectedTopCategory === '운동' && (
        <div>
          {SPORTS_CATEGORIES.map(
            (_, index) =>
              index % 3 === 0 && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="mb-[8px] flex gap-[13px]">
                  {SPORTS_CATEGORIES.slice(index, index + 3).map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`${draftFilters.categories?.includes(category) ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-white text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
                      onClick={() => toggle('categories', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ),
          )}
        </div>
      )}
      {selectedTopCategory === '예술' && (
        <div>
          {ART_CATEGORIES.map(
            (_, index) =>
              index % 3 === 0 && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="mb-[8px] flex gap-[13px]">
                  {ART_CATEGORIES.slice(index, index + 3).map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`${draftFilters.categories?.includes(category) ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-white text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
                      onClick={() => toggle('categories', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ),
          )}
        </div>
      )}
      {selectedTopCategory === '취미' && (
        <div>
          {HOBBY_CATEGORIES.map(
            (_, index) =>
              index % 3 === 0 && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="mb-[8px] flex gap-[13px]">
                  {HOBBY_CATEGORIES.slice(index, index + 3).map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`${draftFilters.categories?.includes(category) ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-white text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
                      onClick={() => toggle('categories', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ),
          )}
        </div>
      )}

      <div className="mb-[8px] flex gap-[13px]">
        <button
          type="button"
          className={`${selectedTopCategory === '사회' ? 'bg-white' : 'bg-gray0'} text-regular14 flex h-[31px] w-[63px] items-center justify-center rounded-[5px] text-gray2`}
          onClick={() => {
            if (selectedTopCategory === '사회') {
              setSelectedTopCategory('');
            } else {
              setSelectedTopCategory('사회');
            }
          }}
        >
          사회
        </button>
        <button
          type="button"
          className={`${selectedTopCategory === '학술' ? 'bg-white' : 'bg-gray0'} text-regular14 flex h-[31px] w-[63px] items-center justify-center rounded-[5px] text-gray2`}
          onClick={() => {
            if (selectedTopCategory === '학술') {
              setSelectedTopCategory('');
            } else {
              setSelectedTopCategory('학술');
            }
          }}
        >
          학술
        </button>
        <button
          type="button"
          className={`${draftFilters.categories?.includes('기타') ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-gray0 text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
          onClick={() => toggle('categories', '기타')}
        >
          기타
        </button>
      </div>

      {selectedTopCategory === '사회' && (
        <div>
          {SOCIETY_CATEGORIES.map(
            (_, index) =>
              index % 3 === 0 && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="mb-[8px] flex gap-[13px]">
                  {SOCIETY_CATEGORIES.slice(index, index + 3).map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`${draftFilters.categories?.includes(category) ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-white text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
                      onClick={() => toggle('categories', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ),
          )}
        </div>
      )}
      {selectedTopCategory === '학술' && (
        <div>
          {ACADEMIC_CATEGORIES.map(
            (_, index) =>
              index % 3 === 0 && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="mb-[8px] flex gap-[13px]">
                  {ACADEMIC_CATEGORIES.slice(index, index + 3).map((category) => (
                    <button
                      type="button"
                      key={category}
                      className={`${draftFilters.categories?.includes(category) ? 'text-bold14 bg-primary text-white' : 'text-regular14 bg-white text-gray2'} flex h-[31px] w-[63px] items-center justify-center rounded-[5px]`}
                      onClick={() => toggle('categories', category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
}

export default CategorySection;
