import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campusClubInfoSchema } from '@/lib/validationSchema';

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
  const [defaultCampusClubType, setDefaultCampusClubType] = useState('');
  const [defaultCategory, setDefaultCategory] = useState('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clubType: clubType as string,
    },
    mode: 'onBlur',
    resolver: yupResolver(campusClubInfoSchema),
  });

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

    router.push(`/club/create/${clubType}/detail`);
  };

  return (
    <form className="flex h-full min-h-screen flex-col justify-between pt-[112px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[8px]">
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
        {errors.campusClubType && <p className="text-regular12 text-error">{errors.campusClubType.message}</p>}
        <div>
          <label htmlFor="name" className="text-bold16 mb-[2px] flex text-gray2">
            동아리명
          </label>
          <input
            id="name"
            {...register('name')}
            className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
          />
        </div>
        {errors.name && <p className="text-regular12 text-error">{errors.name.message}</p>}
        <Controller
          name="category"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CategoryInput value={field.value} onChange={field.onChange} setDefaultCategory={setDefaultCategory} />
          )}
        />
        {errors.category && <p className="text-regular12 text-error">{errors.category.message}</p>}
        {clubType === 'campus' ? (
          <div>
            <label htmlFor="loaction" className="text-bold16 mb-[2px] flex text-gray2">
              학교 내 동아리 위치
            </label>
            <input
              id="location"
              {...register('location')}
              className="text-bold16 flex h-[50px] w-full rounded-[5px] border border-gray0 pl-[8px] text-gray3 outline-none"
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
        {errors.location && <p className="text-regular12 text-error">{errors.location.message}</p>}
        <div>
          <label htmlFor="description" className="text-bold16 mb-[2px] flex text-gray2">
            동아리 한 줄 소개
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="text-bold16 flex w-full resize-none rounded-[5px] border border-gray0 p-[8px] text-gray3 outline-none"
          />
        </div>
        {errors.description && <p className="text-regular12 text-error">{errors.description.message}</p>}
        <Controller
          name="tags"
          control={control}
          defaultValue={clubType === 'union' ? ['연합 동아리', ''] : ['', '']}
          render={({ field }) => (
            <TagInput
              value={field.value}
              onChange={field.onChange}
              defaultCampusClubType={defaultCampusClubType}
              defaultCategory={defaultCategory}
            />
          )}
        />
      </div>
      <SubmitButton>다음</SubmitButton>
    </form>
  );
}

export default InfoForm;
