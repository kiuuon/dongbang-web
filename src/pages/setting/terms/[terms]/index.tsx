import { useRouter } from 'next/router';

import { SERVICE_TERMS } from '@/lib/terms/service-terms';
import { PRIVACY_POLICY } from '@/lib/terms/privacy-policy';
import { THIRD_PARTY_SHARING } from '@/lib/terms/third-party-sharing';
import { COMMUNITY_GUIDE } from '@/lib/terms/community-guide';
import { YOUTH_PROTECTION } from '@/lib/terms/youth-protection';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

const TERMS_DATA_MAP = {
  'service-terms': SERVICE_TERMS,
  'privacy-policy': PRIVACY_POLICY,
  'third-party-consent': THIRD_PARTY_SHARING,
  'community-guide': COMMUNITY_GUIDE,
  'youth-protection': YOUTH_PROTECTION,
};

const TERMS_TITLE_MAP = {
  'service-terms': '서비스 이용약관',
  'privacy-policy': '개인정보 처리방침',
  'third-party-consent': '개인정보 제 3자 제공',
  'community-guide': '커뮤니티 가이드라인',
  'youth-protection': '청소년 보호정책',
};

function TermsDetailPage() {
  const router = useRouter();
  const { terms } = router.query;

  const termsData = TERMS_DATA_MAP[terms as keyof typeof TERMS_DATA_MAP];

  if (!termsData) {
    return <div>Terms not found</div>;
  }

  return (
    <div className="min-h-screen max-w-[600px] bg-white px-[20px] py-[82px]">
      <Header>
        <BackButton />
      </Header>
      <h1 className="text-bold24 mb-[20px]">{TERMS_TITLE_MAP[terms as keyof typeof TERMS_TITLE_MAP]}</h1>

      {termsData.map((section) => (
        <div key={section.id} className="mb-[20px]">
          <h2 className="text-bold20 mb-[10px]">{section.title}</h2>

          <div className="whitespace-pre-wrap">
            {section.content.map((chunk) => (
              <span key={chunk.text} className={chunk.bold ? 'text-bold16' : 'text-regular16'}>
                {chunk.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TermsDetailPage;
