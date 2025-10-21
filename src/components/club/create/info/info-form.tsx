import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campusClubInfoSchema } from '@/lib/validationSchema';
import { useQuery } from '@tanstack/react-query';

import { fetchUser } from '@/lib/apis/user';
import SubmitButton from '@/components/common/submit-button';
import clubInfoStore from '@/stores/club-info-store';
import CampusClubTypeInput from './campus-club-type-input';
import CategoryInput from './category-input';
import LocationInput from './location-input';
import TagInput from './tag-input';

function InfoForm() {
  const router = useRouter();
  const { clubType } = router.query;
  const setClubCampusType = clubInfoStore((state) => state.setCampusClubType);
  const setName = clubInfoStore((state) => state.setName);
  const setCategory = clubInfoStore((state) => state.setCategory);
  const setLocation = clubInfoStore((state) => state.setLocation);
  const setDescription = clubInfoStore((state) => state.setDescription);
  const setTags = clubInfoStore((state) => state.setTags);
  const [defaultCampusClubType, setDefaultCampusClubType] = useState(clubInfoStore.getState().campusClubType ?? '');
  const [defaultCategory, setDefaultCategory] = useState(clubInfoStore.getState().category ?? '');
  const [defaultLocation, setDefaultLocation] = useState(clubInfoStore.getState().location ?? '');
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    throwOnError: (error) => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'error',
            headline: '사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
            message: error.message,
          }),
        );
        return false;
      }
      alert(`사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.\n\n${error.message}`);
      return false;
    },
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      clubType: clubType as string,
      campusClubType: clubInfoStore.getState().campusClubType ?? '',
      name: clubInfoStore.getState().name ?? '',
      category: clubInfoStore.getState().category ?? '',
      location: clubInfoStore.getState().location ?? '',
      description: clubInfoStore.getState().description ?? '',
      tags: clubInfoStore.getState().tags.length ? clubInfoStore.getState().tags : ['', ''],
    },
    mode: 'onBlur',
    resolver: yupResolver(campusClubInfoSchema),
  });

  useEffect(() => {
    if (clubType === 'union' && clubInfoStore.getState().tags.length === 0) {
      setValue('tags', ['연합 동아리', ''], {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else if (clubType !== 'union' && clubInfoStore.getState().tags.length === 0) {
      setValue('tags', [user?.University.name, ''], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [clubType, setValue, user]);

  const onSubmit = (data: {
    campusClubType?: string | undefined;
    name: string;
    category: string;
    location?: string | undefined;
    description: string;
    tags: string[];
  }) => {
    setClubCampusType(data.campusClubType);
    setName(data.name);
    setCategory(data.category);
    setLocation(data.location);
    setDescription(data.description);
    setTags(data.tags);

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
            description: data.description,
            tags: data.tags,
          },
        }),
      );
      return;
    }

    router.push(`/club/create/${clubType}/detail`);
  };

  return (
    <form className="flex h-full min-h-[calc(100vh-92px)] flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[16px]">
        <div className="mb-[8px] mt-[24px] flex flex-col">
          {clubType === 'campus' && (
            <Controller
              name="campusClubType"
              control={control}
              defaultValue=""
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
          render={({ field }) => (
            <CategoryInput value={field.value} onChange={field.onChange} setDefaultCategory={setDefaultCategory} />
          )}
        />
        {errors.category && <p className="text-regular10 mt-[8px] text-error">{errors.category.message}</p>}
        <div>
          {clubType === 'campus' ? (
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
              render={({ field }) => (
                <LocationInput
                  value={field.value as string}
                  onChange={field.onChange}
                  setDefaultLocation={setDefaultLocation}
                />
              )}
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
              id="description"
              {...register('description')}
              placeholder="동아리를 한 줄로 소개해 주세요."
              className="text-regular14 flex h-[48px] w-full resize-none rounded-[8px] border border-gray0 py-[12px] pl-[16px] leading-normal outline-none placeholder:text-gray1"
            />
          </div>
          {errors.description && <p className="text-regular10 mt-[8px] text-error">{errors.description.message}</p>}
        </div>
        <Controller
          name="tags"
          control={control}
          defaultValue={['', '', '']}
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              defaultCampusClubType={defaultCampusClubType}
              defaultCategory={defaultCategory}
              defaultLocation={defaultLocation}
            />
          )}
        />
      </div>
      <SubmitButton disabled={!isValid || isSubmitting}>다음</SubmitButton>
    </form>
  );
}

export default InfoForm;
