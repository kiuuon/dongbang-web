import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campusClubInfoSchema } from '@/lib/validationSchema';

import { fetchUser } from '@/lib/apis/user';
import { fetchClubInfo } from '@/lib/apis/club';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import clubInfoStore from '@/stores/club-info-store';
import SubmitButton from '@/components/common/submit-button';
import CampusClubTypeInput from './campus-club-type-input';
import CategoryInput from './category-input';
import LocationInput from './location-input';

function InfoForm() {
  const router = useRouter();
  const { clubId } = router.query;
  const setClubCampusType = clubInfoStore((state) => state.setCampusClubType);
  const setName = clubInfoStore((state) => state.setName);
  const setCategory = clubInfoStore((state) => state.setCategory);
  const setLocation = clubInfoStore((state) => state.setLocation);
  const setBio = clubInfoStore((state) => state.setBio);
  const setDescription = clubInfoStore((state) => state.setDescription);
  const setTags = clubInfoStore((state) => state.setTags);

  const [defaultCampusClubType, setDefaultCampusClubType] = useState(clubInfoStore.getState().campusClubType ?? '');

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.INFO_FETCH_FAILED),
  });

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      campusClubType: clubInfoStore.getState().campusClubType ?? '',
      name: clubInfoStore.getState().name ?? '',
      category: clubInfoStore.getState().category ?? '',
      location: clubInfoStore.getState().location ?? '',
      bio: clubInfoStore.getState().bio ?? '',
      description: clubInfoStore.getState().description ?? '',
    },

    mode: 'onBlur',
    resolver: yupResolver(campusClubInfoSchema),
  });

  useEffect(() => {
    if (clubInfo) {
      setDefaultCampusClubType(clubInfo.detail_type);
      setClubCampusType(clubInfo.detail_type);
      setName(clubInfo.name);
      setCategory(clubInfo.category);
      setLocation(clubInfo.location);
      setBio(clubInfo.bio);
      setDescription(clubInfo.description);
      setTags(clubInfo.tags);
      setValue('campusClubType', clubInfo.detail_type, { shouldValidate: true });
      setValue('name', clubInfo.name, { shouldValidate: true });
      setValue('category', clubInfo.category, { shouldValidate: true });
      setValue('location', clubInfo.location, { shouldValidate: true });
      setValue('bio', clubInfo.bio, { shouldValidate: true });
      setValue('description', clubInfo.description, { shouldValidate: true });
    }
  }, [clubInfo, setClubCampusType, setName, setCategory, setLocation, setBio, setDescription, setTags, setValue]);

  const onSubmit = (data: {
    campusClubType?: string | undefined;
    name: string;
    category: string;
    location?: string | undefined;
    bio: string;
    description: string;
  }) => {
    setClubCampusType(defaultCampusClubType);
    setName(data.name);
    setCategory(data.category);
    setLocation(data.location);
    setBio(data.bio);
    setDescription(data.description);

    if (clubInfo?.type === 'union') {
      setTags(['연합동아리', data.location as string, data.category]);
    } else {
      setTags([user?.University.name, defaultCampusClubType, data.category]);
    }

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: 'event',
          action: 'complete info form',
          payload: {
            campusClubType: defaultCampusClubType,
            name: data.name,
            category: data.category,
            location: data.location,
            bio: data.bio,
            description: data.description,
            tags:
              clubInfo?.type === 'union'
                ? ['연합동아리', data.location as string, data.category]
                : [user?.University.name, defaultCampusClubType, data.category],
          },
        }),
      );
      return;
    }

    router.push(`/club/${clubId}/edit/detail`);
  };

  return (
    <form className="flex h-full min-h-[calc(100vh-92px)] flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[16px]">
        <div className="mb-[8px] mt-[24px] flex flex-col">
          {clubInfo?.type === 'campus' && (
            <Controller
              name="campusClubType"
              control={control}
              render={({ field }) => (
                <CampusClubTypeInput
                  value={field.value}
                  onChange={field.onChange}
                  setDefaultCampusClubType={setDefaultCampusClubType}
                />
              )}
            />
          )}
          {errors.campusClubType && (
            <p className="text-regular10 mt-[8px] text-error">{errors.campusClubType.message}</p>
          )}
        </div>
        <div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="name" className="text-bold12">
              동아리명
            </label>
            <input
              id="name"
              {...register('name')}
              placeholder="동아리 명을 입력해 주세요."
              className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
            />
          </div>
          {errors.name && <p className="text-regular10 mt-[8px] text-error">{errors.name.message}</p>}
        </div>
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => <CategoryInput value={field.value} onChange={field.onChange} />}
        />
        {errors.category && <p className="text-regular10 mt-[8px] text-error">{errors.category.message}</p>}
        <div>
          {clubInfo?.type === 'campus' ? (
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="name" className="text-bold12">
                학교 내 동아리 위치
              </label>
              <input
                id="location"
                {...register('location')}
                placeholder="동아리 위치를 입력해 주세요."
                className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
              />
            </div>
          ) : (
            <Controller
              name="location"
              control={control}
              defaultValue=""
              render={({ field }) => <LocationInput value={field.value as string} onChange={field.onChange} />}
            />
          )}
          {errors.location && <p className="text-regular10 mt-[8px] text-error">{errors.location.message}</p>}
        </div>
        <div>
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="name" className="text-bold12">
              동아리 한 줄 소개
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              placeholder="동아리를 한 줄로 소개해 주세요."
              className="text-regular14 flex h-[48px] w-full resize-none rounded-[8px] border border-gray0 py-[12px] pl-[16px] leading-normal outline-none placeholder:text-gray1"
            />
          </div>
          {errors.description && <p className="text-regular10 mt-[8px] text-error">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="description" className="text-bold12">
              동아리 상세 설명
            </label>
            <textarea
              id="description"
              {...register('description')}
              className="text-regular14 h-[240px] w-full resize-none rounded-[8px] border border-gray0 p-[16px]"
            />
          </div>
          {errors.description && <p className="text-regular10 mt-[8px] text-error">{errors.description.message}</p>}
        </div>
      </div>
      <SubmitButton disabled={!isValid || isSubmitting}>다음</SubmitButton>
    </form>
  );
}

export default InfoForm;
