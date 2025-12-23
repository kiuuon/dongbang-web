import { useEffect } from 'react';
import { useRouter } from 'next/router';

import termsStore from '@/stores/terms-store';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import InfoForm from '@/components/sign-up/info/info-form';

function SignUpInfoPage() {
  const router = useRouter();
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);

  useEffect(() => {
    if (window.ReactNativeWebView) {
      return;
    }
    if (!termOfUse || !privacyPolicy || !thirdPartyConsent) {
      router.push('/sign-up/terms');
    }
  }, [termOfUse, privacyPolicy, thirdPartyConsent, router]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="mio-h-screen flex min-h-screen flex-col items-start px-[20px] pt-[66px]">
      <Header>
        <BackButton />
      </Header>
      <InfoForm />
    </div>
  );
}

export default SignUpInfoPage;
