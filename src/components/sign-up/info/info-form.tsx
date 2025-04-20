import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getSignUpInfoSchema } from '@/lib/validationSchema';

import SubmitButton from '@/components/common/submit-button';
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

interface UserInfoType {
  name: string;
  birth: string;
  gender: string;
  university: string;
  major: string;
  nickname: string;
  clubCount: string;
  path?: string;
}

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
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
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
    trigger('nickname');
  }, [isSameCheck, isDuplicate, trigger]);

  const onSubmit = (data: UserInfoType) => {
    const body = {
      id: session?.user?.id as string,
      name: data.name,
      birth: `${data.birth.slice(0, 4)}-${data.birth.slice(4, 6)}-${data.birth.slice(6, 8)}`,
      gender: data.gender,
      email: session?.user?.email as string,
      nickname: data.nickname,
      university_id: universityList?.find((item) => item.name === data.university)?.id,
      major: data.major,
      clubs_joined: data.clubCount,
      join_path: data.path || null,
      term_of_use: termOfUse,
      privacy_policy: privacyPolicy,
      third_party_consent: thirdPartyConsent,
      marketing,
    };
    handleSignup(body);
  };

  return (
    <form className="mt-[56px] flex w-full flex-col gap-[8px]" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name" className="text-bold16 mb-[2px] flex text-gray2">
          이름
        </label>
        <input
          id="name"
          {...register('name')}
          className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
        />
      </div>
      {errors.name && <span className="text-regular12 text-error">{errors.name.message}</span>}
      <Controller
        name="gender"
        control={control}
        defaultValue=""
        render={({ field }) => <GenderInput value={field.value} onChange={field.onChange} />}
      />
      {errors.gender && <span className="text-regular12 text-error">{errors.gender.message}</span>}
      <div>
        <label htmlFor="birth" className="text-bold16 mb-[2px] flex text-gray2">
          생년월일
        </label>
        <input
          id="birth"
          {...register('birth')}
          placeholder="ex) 20000413"
          className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none placeholder:text-gray0"
        />
      </div>
      {errors.birth && <span className="text-regular12 text-error">{errors.birth.message}</span>}
      <Controller
        name="university"
        control={control}
        defaultValue=""
        render={({ field }) => <UniversityInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} />}
      />
      {errors.university && <span className="text-regular12 text-error">{errors.university.message}</span>}
      <div>
        <label htmlFor="major" className="text-bold16 mb-[2px] flex text-gray2">
          학과
        </label>
        <input
          id="major"
          {...register('major')}
          className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
        />
      </div>
      {errors.major && <span className="text-regular12 text-error">{errors.major.message}</span>}
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
      {errors.nickname && <span className="text-regular12 text-error">{errors.nickname.message}</span>}
      {isSameCheck && <span className="text-regular12 text-[#48E577]">사용 가능한 닉네임입니다.</span>}
      <Controller
        name="clubCount"
        control={control}
        defaultValue=""
        render={({ field }) => <ClubCountInput value={field.value} onChange={field.onChange} />}
      />
      {errors.clubCount && <span className="text-regular12 text-error">{errors.clubCount.message}</span>}

      <Controller
        name="path"
        control={control}
        defaultValue=""
        render={({ field }) => <PathInput value={field.value} onChange={field.onChange} />}
      />

      <SubmitButton>가입하기</SubmitButton>
      {isModalOpen && <SignUpCompleteModal />}
    </form>
  );
}

export default InfoForm;
