import { useEffect, useState } from 'react';
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

  const handleUniversityClick = (n: string) => {
    onChange(n);
    setIsUniversityDropdownOpen(false);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="university" className="text-bold16 flex text-gray2">
        학교
      </label>
      <input
        id="university"
        value={value}
        className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
        onChange={handleUniversity}
        onBlur={onBlur}
      />
      {isUniversityDropdownOpen && (
        <div className="mt-[8px] flex flex-col gap-[8px]">
          {searchedUniversityList?.map((item) => (
            <button
              type="button"
              key={item.id}
              className="text-bold 16 h-[28px] w-full cursor-pointer pl-[8px] text-left text-gray3"
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
