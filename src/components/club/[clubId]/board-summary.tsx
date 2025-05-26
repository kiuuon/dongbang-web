import { useState } from 'react';

function BoardSummary() {
  const [selectedTab, setSelectedTab] = useState<'feed' | 'board'>('feed');

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-[12px]">
          <button
            type="button"
            className={`h-[32px] w-[64px] rounded-[24px] ${
              selectedTab === 'feed' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'
            }`}
            onClick={() => setSelectedTab('feed')}
          >
            피드
          </button>
          <button
            type="button"
            className={`h-[32px] w-[64px] rounded-[24px] ${
              selectedTab === 'board' ? 'text-bold12 bg-primary text-white' : 'text-regular12 bg-gray0 text-black'
            }`}
            onClick={() => setSelectedTab('board')}
          >
            게시판
          </button>
        </div>
        <button type="button" className="text-bold12 h-[32px] w-[47px] rounded-[8px] bg-gray0">
          더보기
        </button>
      </div>
    </div>
  );
}

export default BoardSummary;
