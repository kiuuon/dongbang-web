import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchUniversityList } from '@/lib/apis/sign-up';
import { signUpErrorMessages } from '@/lib/constants';
import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function UniversityInput() {
  const university = userInfoStore((state) => state.university);
  const setUniversity = userInfoStore((state) => state.setUniversity);
  const universityError = userInfoErrorStore((state) => state.universityError);
  const setUniversityError = userInfoErrorStore((state) => state.setUniversityError);
  const [searchedUniversityList, setSearchedUniversityList] = useState<Array<{ id: number; name: string }>>([]);

  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const useniversityDropdownRef = useRef<HTMLDivElement>(null);
  const { data: universityList } = useQuery({ queryKey: ['universityList'], queryFn: fetchUniversityList });

  const handleUniversity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniversity(event.target.value);

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

  const handleUniversityFocus = () => {
    if (searchedUniversityList.length > 0) {
      setIsUniversityDropdownOpen(true);
    }
  };

  const handleUniversityBlur = () => {
    if (universityList?.some((item) => item.name === university)) {
      setUniversityError(false);
    } else {
      setUniversityError(true);
    }
  };

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
    setUniversity(n);
    setIsUniversityDropdownOpen(false);
    setUniversityError(false);
  };

  return (
    <div>
      <div className="text-[14px] text-[#969696]">학교</div>
      <div className="relative flex gap-[4px]">
        <input
          value={university}
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleUniversity}
          onFocus={handleUniversityFocus}
          onBlur={handleUniversityBlur}
        />
        {universityError && (
          <div className="flex items-center text-[6px] text-[#CB0101]">
            {signUpErrorMessages.universityErrorMessage}
          </div>
        )}
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
