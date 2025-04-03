import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSignUpInfoSchema } from '@/lib/validationSchema';

import { fetchUniversityList, signUp } from '@/lib/apis/sign-up';
import { fetchSession } from '@/lib/apis/auth';
import { queryKey } from '@/lib/constants';
import { UserType } from '@/types/user-type';
import termsStore from '@/stores/terms-store';
import GenderInput from './gender-input';
import UniversityInput from './university-input';
import NicknameInput from './nickname-input';
import ClubCountInput from './club-count-input';
import PathInput from './path-input';
import SignUpCompleteModal from './sign-up-complete-modal';

function InfoForm() {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSameCheck, setIsSameCheck] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);

  const { data: session } = useQuery({ queryKey: [queryKey.session], queryFn: fetchSession });
  const { data: universityList } = useQuery({
    queryKey: [queryKey.universityList],
    queryFn: fetchUniversityList,
  });

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

  const signUpInfoSchema = universityList ? getSignUpInfoSchema(universityList, isDuplicate, isSameCheck) : null;

  const {
    control,
    register,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    resolver: signUpInfoSchema
      ? yupResolver(signUpInfoSchema, {
          context: {
            isDuplicate,
            isSameCheck,
          },
        })
      : undefined,
  });

  useEffect(() => {
    trigger('nickname'); // isSameCheck나 isDuplicate가 바뀔 때 트리거!
  }, [isSameCheck, isDuplicate, trigger]);

  const onSubmit = (data: any) => {
    const body = {
      id: session?.user?.id as string,
      name: data.name,
      birth: `${data.birth.slice(0, 4)}-${data.birth.slice(4, 6)}-${data.birth.slice(6, 8)}`,
      gender: data.gender,
      email: session?.user?.email as string,
      nickname: data.nickname,
      university_id: universityList?.find((item) => item.name === data.university)?.id,
      clubs_joined: data.clubCount,
      mbti: data.mbti || null,
      join_path: data.path || null,
      term_of_use: termOfUse,
      privacy_policy: privacyPolicy,
      third_party_consent: thirdPartyConsent,
      marketing,
    };
    handleSignup(body);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-[25px] mt-[50px] text-[20px] font-black">회원가입</div>
      <input
        {...register('name')}
        className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
        placeholder="이름"
      />
      {errors.name && <span className="text-[6px] text-[#CB0101]">{errors.name.message}</span>}
      <Controller
        name="gender"
        control={control}
        defaultValue=""
        render={({ field }) => <GenderInput value={field.value} onChange={field.onChange} />}
      />
      {errors.gender && <span className="text-[6px] text-[#CB0101]">{errors.gender.message}</span>}
      <input
        {...register('birth')}
        className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
        placeholder="생년월일"
      />
      {errors.birth && <span className="text-[6px] text-[#CB0101]">{errors.birth.message}</span>}
      <Controller
        name="university"
        control={control}
        defaultValue=""
        render={({ field }) => <UniversityInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} />}
      />
      {errors.university && <span className="text-[6px] text-[#CB0101]">{errors.university.message}</span>}
      <Controller
        name="nickname"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <NicknameInput
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            setIsDuplicate={setIsDuplicate}
            setIsSameCheck={setIsSameCheck}
          />
        )}
      />
      {errors.nickname && <span className="text-[6px] text-[#CB0101]">{errors.nickname.message}</span>}
      <Controller
        name="clubCount"
        control={control}
        defaultValue=""
        render={({ field }) => <ClubCountInput value={field.value} onChange={field.onChange} />}
      />
      {errors.clubCount && <span className="text-[6px] text-[#CB0101]">{errors.clubCount.message}</span>}
      <input
        {...register('mbti')}
        className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
        placeholder="MBTI"
        onChange={(event) => {
          setValue('mbti', event.target.value.toUpperCase());
        }}
      />
      {errors.mbti && <span className="text-[6px] text-[#CB0101]">{errors.mbti.message}</span>}
      <Controller
        name="path"
        control={control}
        defaultValue=""
        render={({ field }) => <PathInput value={field.value} onChange={field.onChange} />}
      />
      <button type="submit" className="mb-[40px] h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]">
        가입하기
      </button>
      {isModalOpen && <SignUpCompleteModal />}
    </form>
  );
}

export default InfoForm;
