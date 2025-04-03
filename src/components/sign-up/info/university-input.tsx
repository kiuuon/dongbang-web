import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/lib/apis/sign-up';
import { queryKey } from '@/lib/constants';

function UniversityInput({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const useniversityDropdownRef = useRef<HTMLDivElement>(null);
  const [searchedUniversityList, setSearchedUniversityList] = useState<Array<{ id: number; name: string }>>([]);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const { data: universityList } = useQuery({ queryKey: [queryKey.universityList], queryFn: fetchUniversityList });

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isUniversityDropdownOpen &&
        useniversityDropdownRef.current &&
        !useniversityDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUniversityDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUniversityDropdownOpen]);

  const handleUniversityClick = (n: string) => {
    onChange(n);
    setIsUniversityDropdownOpen(false);
  };

  return (
    <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
      <label htmlFor="university" className="text-bold12 flex text-gray2">
        학교
      </label>
      <div className="relative flex gap-[4px]">
        <input
          id="university"
          value={value}
          className="text-bold12 w-[224px] text-center text-gray2 outline-none placeholder:text-gray0"
          onChange={handleUniversity}
          onBlur={onBlur}
        />
        {isUniversityDropdownOpen && (
          <div
            ref={useniversityDropdownRef}
            className="absolute left-[-20px] top-[20px] h-[94px] w-[253px] overflow-y-auto rounded-b-[5px] border border-tertiary bg-[#fff] px-[5px]"
          >
            {searchedUniversityList?.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={`text-regular12 h-[23px] w-[241px] cursor-pointer ${index !== 0 && 'border-t'} border-tertiary pl-[2px]`}
                onClick={() => handleUniversityClick(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversityInput;
