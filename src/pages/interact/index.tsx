import { useState } from 'react';

function InteractPage() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col rounded-b-[16px] bg-white shadow-[0_2px_20px_0_rgba(0,0,0,0.16)]">
        <div className="text-bold16 flex h-[60px] items-center justify-center">교류 공고</div>
        <div className="px-[20px] pb-[12px] pt-[9px]">
          <input
            type="text"
            value={inputValue}
            placeholder="검색"
            className="text-regular16 w-full rounded-[10px] bg-gray0 px-[12px] py-[10px] placeholder:text-gray2"
            onChange={(event) => setInputValue(event.target.value)}
          />
        </div>
        <div className="h-[38px]" />
      </div>
      <div className="text-bold24 mt-[200px] w-full text-center">등록된 교류 공고가 없습니다.</div>
    </div>
  );
}

export default InteractPage;
