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

interface UserInfoType {
  name: string;
  birth: string;
  gender: string;
  university: string;
  major: string;
  nickname: string;
  clubCount: string;
  mbti?: string | null;
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
    setValue,
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
    trigger('nickname'); // isSameCheck나 isDuplicate가 바뀔 때 트리거!
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
    <form className="mt-[20px] flex w-full flex-col gap-[16px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[8px]">
        <div className="text-bold16 text-black text-[20px]">소속 정보</div>
        <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
          <label htmlFor="name" className="text-bold12 flex text-gray2">
            이름
          </label>
          <input
            id="name"
            {...register('name')}
            className="text-bold12 w-[224px] text-center text-gray2 outline-none"
          />
        </div>
        {errors.name && <span className="text-bold10 text-error">{errors.name.message}</span>}
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => <GenderInput value={field.value} onChange={field.onChange} />}
        />
        {errors.gender && <span className="text-bold10 text-error">{errors.gender.message}</span>}
        <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
          <label htmlFor="birth" className="text-bold12 flex text-gray2">
            생년월일
          </label>
          <input
            id="birth"
            {...register('birth')}
            placeholder="ex) 20000413"
            className="text-bold12 w-[224px] text-center text-gray2 outline-none placeholder:text-gray0"
          />
        </div>
        {errors.birth && <span className="text-bold10 text-error">{errors.birth.message}</span>}
        <Controller
          name="university"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <UniversityInput value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
          )}
        />
        {errors.university && <span className="text-bold10 text-error">{errors.university.message}</span>}
        <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
          <label htmlFor="major" className="text-bold12 flex text-gray2">
            학과
          </label>
          <input
            id="major"
            {...register('major')}
            className="text-bold12 w-[224px] text-center text-gray2 outline-none"
          />
        </div>
        {errors.major && <span className="text-bold10 text-error">{errors.major.message}</span>}
      </div>
      <div className="flex flex-col gap-[8px]">
        <div className="text-bold16 text-black text-[20px]">닉네임</div>
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
        {errors.nickname && <span className="text-bold10 text-error">{errors.nickname.message}</span>}
        {isSameCheck && <span className="text-bold10 text-[#48E577]">사용 가능한 닉네임입니다.</span>}
      </div>
      <div className="flex flex-col gap-[8px]">
        <div className="text-bold16 text-black text-[20px]">구분 정보</div>
        <Controller
          name="clubCount"
          control={control}
          defaultValue=""
          render={({ field }) => <ClubCountInput value={field.value} onChange={field.onChange} />}
        />
        {errors.clubCount && <span className="text-bold10 text-error">{errors.clubCount.message}</span>}
        <div className="flex h-[40px] w-full items-center justify-between rounded-[5px] border border-tertiary pl-[8px] pr-[20px]">
          <label htmlFor="mbti" className="text-bold12 flex text-gray2">
            MBTI(선택)
          </label>
          <input
            id="mbti"
            {...register('mbti')}
            className="text-bold12 w-[224px] text-center text-gray2 outline-none"
            onChange={(event) => {
              setValue('mbti', event.target.value.toUpperCase());
            }}
          />
        </div>
        {errors.mbti && <span className="text-bold10 text-error">{errors.mbti.message}</span>}
        <Controller
          name="path"
          control={control}
          defaultValue=""
          render={({ field }) => <PathInput value={field.value} onChange={field.onChange} />}
        />
      </div>
      <button
        type="submit"
        className="text-bold32 mb-[16px] mt-[48px] h-[74px] w-full rounded-[5px] bg-primary text-tertiary_dark"
      >
        가입하기
      </button>
      {isModalOpen && <SignUpCompleteModal />}
    </form>
  );
}

export default InfoForm;
