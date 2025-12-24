import { useRouter } from 'next/router';

import RightArrowIcon2 from '@/icons/right-arrow-icon2';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function TermsPage() {
  const router = useRouter();

  return (
    <div className="h-screen pt-[82px]">
      <div className="px-[20px]">
        <Header>
          <div className="flex items-center gap-[10px]">
            <BackButton />
            <div className="text-bold16">약관 및 정책</div>
          </div>
        </Header>
      </div>
      <div className="border-t border-gray0">
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to terms detail page', payload: 'service-terms' }),
              );
            } else {
              router.push('/setting/terms/service-terms');
            }
          }}
        >
          서비스 이용약관
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to terms detail page', payload: 'privacy-policy' }),
              );
            } else {
              router.push('/setting/terms/privacy-policy');
            }
          }}
        >
          개인정보 처리방침
          <RightArrowIcon2 />
        </button>

        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to terms detail page', payload: 'third-party-consent' }),
              );
            } else {
              router.push('/setting/terms/third-party-consent');
            }
          }}
        >
          개인정보 제 3자 제공
          <RightArrowIcon2 />
        </button>
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to terms detail page', payload: 'community-guide' }),
              );
            } else {
              router.push('/setting/terms/community-guide');
            }
          }}
        >
          커뮤니티 가이드라인
          <RightArrowIcon2 />
        </button>
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'go to terms detail page', payload: 'youth-protection' }),
              );
            } else {
              router.push('/setting/terms/youth-protection');
            }
          }}
        >
          청소년 보호정책
          <RightArrowIcon2 />
        </button>
        <button
          type="button"
          className="text-regular14 flex w-full items-center justify-between border-b border-gray0 py-[18px] pl-[24px] pr-[20px]"
          onClick={() => {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(
                JSON.stringify({ type: 'event', action: 'open GitHub repository' }),
              );
            } else {
              window.open('https://github.com/kiuuon/dongbang-app', '_blank');
            }
          }}
        >
          오픈소스 라이선스
          <RightArrowIcon2 />
        </button>
      </div>
    </div>
  );
}

export default TermsPage;
