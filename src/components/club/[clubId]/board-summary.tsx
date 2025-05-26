import { useState } from 'react';
import { useRouter } from 'next/router';

function BoardSummary() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'feed' | 'board'>('feed');

  const goToCommingSoon = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage('comingSoon');
      return;
    }
    router.push('/coming-soon');
  };

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
        <button
          type="button"
          className="text-bold12 h-[32px] w-[47px] rounded-[8px] bg-gray0"
          onClick={goToCommingSoon}
        >
          더보기
        </button>
      </div>
    </div>
  );
}

export default BoardSummary;
