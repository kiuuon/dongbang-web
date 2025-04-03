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
    <div>
      <div className="text-[14px] text-[#969696]">학교</div>
      <div className="relative flex gap-[4px]">
        <input
          value={value}
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleUniversity}
          onBlur={onBlur}
        />

        {isUniversityDropdownOpen && (
          <div
            ref={useniversityDropdownRef}
            className="absolute left-[0] top-[30px] h-[150px] w-[136px] overflow-y-auto rounded-[5px] border border-[#969696] bg-[#F5F5F5]"
          >
            {searchedUniversityList?.map((item) => (
              <button
                type="button"
                key={item.id}
                className="w-full cursor-pointer border-b border-[#969696] p-[5px] hover:bg-[#D9D9D9]"
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
