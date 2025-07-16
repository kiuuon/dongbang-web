import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/lib/apis/sign-up';

function UniversityInput({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const [searchedUniversityList, setSearchedUniversityList] = useState<Array<{ id: number; name: string }>>([]);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const { data: universityList } = useQuery({ queryKey: ['universityList'], queryFn: fetchUniversityList });

  const handleUniversity = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);

    if (!universityList) return;

    if (event.target.value === '') {
      setSearchedUniversityList([]);
    } else {
      const searchedList = universityList.filter((item) => item.name.includes(event.target.value));
      setSearchedUniversityList(searchedList as Array<{ id: number; name: string }>);
    }
  };

  useEffect(() => {
    if (searchedUniversityList.length !== 0) {
      setIsUniversityDropdownOpen(true);
    } else {
      setIsUniversityDropdownOpen(false);
    }
  }, [searchedUniversityList]);

  const handleUniversityClick = (n: string) => {
    onChange(n);
    setIsUniversityDropdownOpen(false);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor="university" className="text-bold12">
        학교
      </label>
      <input
        id="university"
        value={value}
        placeholder="학교 이름을 입력해주세요."
        className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
        onChange={handleUniversity}
        onBlur={onBlur}
      />
      {isUniversityDropdownOpen && (
        <div className="mt-[8px] flex flex-col gap-[8px]">
          {searchedUniversityList?.map((item) => (
            <button
              type="button"
              key={item.id}
              className="text-regular14 h-[28px] w-full cursor-pointer pl-[8px] text-left"
              onMouseDown={(event) => {
                event.preventDefault();
                handleUniversityClick(item.name);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default UniversityInput;
