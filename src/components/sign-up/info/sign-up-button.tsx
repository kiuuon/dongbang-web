import { useQuery, useMutation } from '@tanstack/react-query';

import { fetchSession } from '@/lib/apis/auth';
import { signUp, fetchUniversityList } from '@/lib/apis/sign-up';
import { queryKey, signUpErrorMessages } from '@/lib/constants';
import { UserType } from '@/types/user-type';
import termsStore from '@/stores/sign-up/terms-store';
import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function SignUpButton({ setIsModalOpen }: { setIsModalOpen: (isModalOpen: boolean) => void }) {
  const { data: session } = useQuery({ queryKey: [queryKey.session], queryFn: fetchSession });

  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);

  const name = userInfoStore((state) => state.name);
  const birth = userInfoStore((state) => state.birth);
  const gender = userInfoStore((state) => state.gender);
  const nickname = userInfoStore((state) => state.nickname);
  const university = userInfoStore((state) => state.university);
  const { data: universityList } = useQuery({ queryKey: [queryKey.universityList], queryFn: fetchUniversityList });
  const clubCount = userInfoStore((state) => state.clubCount);
  const mbti = userInfoStore((state) => state.mbti);
  const path = userInfoStore((state) => state.path);
  const etcPath = userInfoStore((state) => state.etcPath);

  const nameError = userInfoErrorStore((state) => state.nameError);
  const birthError = userInfoErrorStore((state) => state.birthError);
  const nicknameError = userInfoErrorStore((state) => state.nicknameError);
  const universityError = userInfoErrorStore((state) => state.universityError);
  const mbtiError = userInfoErrorStore((state) => state.mbtiError);
  const isSameCheck = userInfoErrorStore((state) => state.isSameCheck);
  const isAvailableNickname = userInfoErrorStore((state) => state.isAvailableNickname);

  const { mutate: handleSignup } = useMutation({
    mutationFn: (body: UserType) => signUp(body),
    onSuccess: () => {
      setIsModalOpen(true);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const handleSignupButton = () => {
    if (
      nameError ||
      birthError ||
      nicknameError ||
      universityError ||
      mbtiError ||
      !isSameCheck ||
      !isAvailableNickname ||
      gender === '' ||
      clubCount === ''
    ) {
      // eslint-disable-next-line no-alert
      alert(signUpErrorMessages.infoErrorMessage);
    } else {
      const data = {
        id: session?.user?.id as string,
        name,
        birth: `${birth.slice(0, 4)}-${birth.slice(4, 6)}-${birth.slice(6, 8)}`,
        gender,
        email: session?.user?.email as string,
        nickname,
        university_id: universityList?.find((item) => item.name === university)?.id,
        clubs_joined: clubCount,
        mbti: mbti || null,
        join_path: (path === '기타' ? etcPath : path) || null,
        term_of_use: termOfUse,
        privacy_policy: privacyPolicy,
        third_party_consent: thirdPartyConsent,
        marketing,
      };
      handleSignup(data);
      setIsModalOpen(true);
    }
  };

  return (
    <button
      type="button"
      className="mb-[40px] h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
      onClick={handleSignupButton}
    >
      가입하기
    </button>
  );
}

export default SignUpButton;
