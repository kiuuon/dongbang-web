import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { fetchUniversityList, signUp } from '@/lib/apis/sign-up';
import { fetchSession } from '@/lib/apis/auth';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { upload } from '@/lib/apis/image';
import { ERROR_MESSAGE } from '@/lib/constants';
import { getSignUpInfoSchema } from '@/lib/validationSchema';
import termsStore from '@/stores/terms-store';
import { UserType } from '@/types/user-type';
import SubmitButton from '@/components/common/submit-button';
import Loading from '@/components/common/loading';
import GenderInput from './gender-input';
import UniversityInput from './university-input';
import NicknameInput from './nickname-input';
import AvatarInput from './avatar-input';

interface UserInfoType {
  avatar?: File | null;
  name: string;
  gender: string;
  university: string;
  major: string;
  nickname: string;
}

function InfoForm() {
  const router = useRouter();
  const uuid = crypto.randomUUID();
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSameCheck, setIsSameCheck] = useState(false);
  const termOfUse = termsStore((state) => state.temrOfUse);
  const privacyPolicy = termsStore((state) => state.privacyPolicy);
  const thirdPartyConsent = termsStore((state) => state.thirdPartyConsent);
  const marketing = termsStore((state) => state.marketing);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = (router.query.redirect as string) || '/';

  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: universityList } = useQuery({
    queryKey: ['universityList'],
    queryFn: fetchUniversityList,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.UNIVERSITY.LIST_FETCH_FAILED),
  });

  const { mutate: handleSignup } = useMutation({
    mutationFn: (body: UserType) => signUp(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (redirectTo === '/') {
        router.push('/sign-up/complete');
      } else {
        router.push(`/sign-up/complete?redirect=${redirectTo}`);
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.USER.SIGN_UP_FAILED),
  });

  const { mutateAsync: uploadAvatar } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'profile-image'),
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.IMAGE.AVATAR_UPLOAD_FAILED, () => setIsLoading(false)),
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
      gender: '',
      university: '',
      major: '',
      nickname: '',
    },
  });

  useEffect(() => {
    trigger('nickname');
  }, [isSameCheck, isDuplicate, trigger]);

  const onSubmit = async (data: UserInfoType) => {
    try {
      let avatar: string | undefined;

      if (data.avatar) {
        setIsLoading(true);
        const avatarFileName = `logo/${uuid}.png`;
        const uploadResult = await uploadAvatar({ file: data.avatar, fileName: avatarFileName });
        avatar = uploadResult.publicUrl;
      }

      const body = {
        id: session?.user?.id as string,
        name: data.name,
        gender: data.gender,
        nickname: data.nickname,
        university_id: universityList?.find((item) => item.name === data.university)?.id,
        major: data.major,
        term_of_use: termOfUse,
        privacy_policy: privacyPolicy,
        third_party_consent: thirdPartyConsent,
        marketing,
        ...(avatar && { avatar }),
      };
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'sign up',
            payload: {
              id: session?.user?.id as string,
              name: data.name,
              gender: data.gender,
              nickname: data.nickname,
              university_id: universityList?.find((item) => item.name === data.university)?.id,
              major: data.major,
              ...(avatar && { avatar }),
            },
          }),
        );
        return;
      }
      handleSignup(body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <form className="flex h-full w-full flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-[16px]">
        {/* 학생증 */}
        <div className="w-full rounded-[10px] bg-gradient-to-br from-[#FFF9E8] via-[#FFE6A1] to-[#F9A825] p-[20px]">
          <div className="flex justify-between">
            <div className="flex gap-[14px]">
              <div>
                <Controller
                  name="avatar"
                  control={control}
                  defaultValue={undefined}
                  render={({ field }) => <AvatarInput onChange={field.onChange} />}
                />
              </div>
              <div className="pt-[12px]">
                <div className="text-bold16">{name}</div>
                <div className="text-regular14 text-gray2">{nickname}</div>
              </div>
            </div>
            <div className="flex h-auto items-center justify-center">
              <div className="text-bold12 rounded-[20px] bg-secondary px-[7px] py-[5px]">학생증</div>
            </div>
          </div>
          <div className="mb-[8px] mt-[22px] h-[1px] w-full bg-gray1 opacity-50" />
          <div className="text-regular14 flex flex-col gap-[4px] text-gray2">
            <div className="flex justify-between">
              <span>학교</span>
              <span>{university}</span>
            </div>
            <div className="flex justify-between">
              <span>학과</span>
              <span>{major}</span>
            </div>
          </div>
        </div>

        {/* 성별 */}
        <div className="mb-[8px] flex flex-col">
          <Controller
            name="gender"
            control={control}
            defaultValue=""
            render={({ field }) => <GenderInput value={field.value} onChange={field.onChange} />}
          />
          {errors.gender && <span className="text-regular10 mt-[8px] text-error">{errors.gender.message}</span>}
        </div>

        {/* 사용자명 */}
        <div>
          <Controller
            name="nickname"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <NicknameInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setNickname(value);
                }}
                onBlur={field.onBlur}
                setIsDuplicate={setIsDuplicate}
                setIsSameCheck={setIsSameCheck}
              />
            )}
          />
          {errors.nickname && <span className="text-regular10 mt-[8px] text-error">{errors.nickname.message}</span>}
          {!errors.nickname && isSameCheck && (
            <span className="text-regular10 mt-[8px] pl-[8px] text-[#009E25]">사용 가능한 사용자명입니다.</span>
          )}
        </div>

        {/* 이름 */}
        <div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="name" className="text-bold12">
              이름
            </label>
            <input
              id="name"
              {...register('name')}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력해주세요."
              className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
            />
          </div>
          {errors.name && <span className="text-regular10 mt-[8px] pl-[8px] text-error">{errors.name.message}</span>}
        </div>

        {/* 학교 */}
        <div>
          <Controller
            name="university"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <UniversityInput
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setUniversity(value);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.university && (
            <span className="text-regular10 mt-[8px] pl-[8px] text-error">{errors.university.message}</span>
          )}
        </div>

        {/* 학과 */}
        <div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="major" className="text-bold12">
              학과
            </label>
            <input
              id="major"
              {...register('major')}
              onChange={(event) => setMajor(event.target.value)}
              placeholder="전공을 입력해주세요."
              className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
            />
          </div>
          {errors.major && <span className="text-regular10 mt-[8px] pl-[8px] text-error">{errors.major.message}</span>}
        </div>
      </div>

      <SubmitButton disabled={!isValid || isSubmitting || !isDirty}>가입하기</SubmitButton>

      {isLoading && <Loading />}
    </form>
  );
}

export default InfoForm;
