import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSameCheck, setIsSameCheck] = useState(false);
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
      router.push('/sign-up/complete');
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
    formState: { errors, isValid, isSubmitting, isDirty },
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
    defaultValues: {
      name: '',
      birth: '',
      gender: '',
      university: '',
      major: '',
      nickname: '',
      clubCount: '',
      path: '',
    },
  });

  useEffect(() => {
    trigger('nickname');
  }, [isSameCheck, isDuplicate, trigger]);

  const onSubmit = (data: UserInfoType) => {
    const body = {
      id: session?.user?.id as string,
      name: data.name,
      birth: `${+data.birth.slice(0, 2) < 50 ? '20' : '19'}${data.birth.slice(0, 2)}-${data.birth.slice(2, 4)}-${data.birth.slice(4, 6)}`,
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
    <form className="flex w-full flex-col gap-[16px]" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="name" className="text-bold12">
            이름
          </label>
          <input
            id="name"
            {...register('name')}
            placeholder="이름을 입력해주세요."
            className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
          />
        </div>
        {errors.name && <span className="text-regular10 mt-[8px] text-error">{errors.name.message}</span>}
      </div>
      <div className="mb-[8px] flex flex-col">
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => <GenderInput value={field.value} onChange={field.onChange} />}
        />
        {errors.gender && <span className="text-regular10 mt-[8px] text-error">{errors.gender.message}</span>}
      </div>
      <div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="birth" className="text-bold12">
            생년월일
          </label>
          <input
            id="birth"
            {...register('birth')}
            placeholder="생년월일을 입력해주세요. ex) 000413"
            className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
          />
        </div>
        {errors.birth && <span className="text-regular10 mt-[8px] text-error">{errors.birth.message}</span>}
      </div>
      <div>
        <Controller
          name="university"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UniversityInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
          )}
        />
        {errors.university && <span className="text-regular10 mt-[8px] text-error">{errors.university.message}</span>}
      </div>
      <div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="major" className="text-bold12">
            학과
          </label>
          <input
            id="major"
            {...register('major')}
            placeholder="전공을 입력해주세요."
            className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
          />
        </div>
        {errors.major && <span className="text-regular10 mt-[8px] text-error">{errors.major.message}</span>}
      </div>
      <div>
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
        {errors.nickname && <span className="text-regular10 mt-[8px] text-error">{errors.nickname.message}</span>}
        {isSameCheck && <span className="text-regular10 mt-[8px] text-[#009E25]">사용 가능한 닉네임입니다.</span>}
      </div>
      <div className="mb-[8px] flex flex-col">
        <Controller
          name="clubCount"
          control={control}
          defaultValue=""
          render={({ field }) => <ClubCountInput value={field.value} onChange={field.onChange} />}
        />
        {errors.clubCount && <span className="text-regular10 mt-[8px] text-error">{errors.clubCount.message}</span>}
      </div>
      <Controller
        name="path"
        control={control}
        defaultValue=""
        render={({ field }) => <PathInput value={field.value} onChange={field.onChange} />}
      />
      <SubmitButton disabled={!isValid || isSubmitting || !isDirty}>가입하기</SubmitButton>
    </form>
  );
}

export default InfoForm;
