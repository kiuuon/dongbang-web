import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import NameInput from '@/components/sign-up/info/name-input';
import BirthInput from '@/components/sign-up/info/birth-input';
import GenderInput from '@/components/sign-up/info/gender-input';
import NicknameInput from '@/components/sign-up/info/nickname-input';
import UniversityInput from '@/components/sign-up/info/university-input';
import ClubCountInput from '@/components/sign-up/info/club-count-input';
import MbtiInput from '@/components/sign-up/info/mbti-input';
import PathInput from '@/components/sign-up/info/path-input';
import SignUpCompleteModal from '@/components/sign-up/info/sign-up-complete-modal';
import SignUpButton from '@/components/sign-up/info/sign-up-button';
import termsStore from '@/stores/sign-up/terms-store';

function Info() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);

  useEffect(() => {
    if (!termOfUse || !privacyPolicy || !thirdPartyConsent) {
      router.push('/sign-up/terms');
    }
  }, [router, termOfUse, privacyPolicy, thirdPartyConsent]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] p-[40px]">
      <div className="mb-[25px] mt-[50px] text-[20px] font-black">회원가입</div>
      <div>
        <NameInput />
        <BirthInput />
        <GenderInput />
        <NicknameInput />
        <UniversityInput />
        <ClubCountInput />
        <MbtiInput />
        <PathInput />
      </div>
      <div className="mt-[40px] flex justify-center">
        <SignUpButton setIsModalOpen={setIsModalOpen} />
      </div>
      {isModalOpen && <SignUpCompleteModal />}
    </div>
  );
}

export default Info;
