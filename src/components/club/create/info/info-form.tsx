import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { campusClubInfoSchema } from '@/lib/validationSchema';

import clubInfoStore from '@/stores/create-club/club-info-store';
import CampusClubTypeInput from './campus-club-type-input';
import CategoryInput from './category-input';
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
    resolver: yupResolver(campusClubInfoSchema),
  });

  const onSubmit = (data: {
    campusClubType?: string | undefined;
    name: string;
    category: string;
    location: string;
    description: string;
    tags: string[];
  }) => {
    setClubCampusType(data.campusClubType);
    setName(data.name);
    setCategory(data.category);
    setLocation(data.location);
    setDescription(data.description);
    if (clubType === 'campus') {
      setTags(data.tags);
    } else {
      const newTags = [...data.tags];
      newTags.shift();
      setTags(newTags);
    }

    router.push(`/club/create/${clubType}/detail`);
  };

  return (
    <form className="mt-[80px] flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
      {errors.campusClubType && <p className="text-red-500">{errors.campusClubType.message}</p>}
      <input {...register('name')} placeholder="동아리명" className="rounded border p-2" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <Controller
        name="category"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <CategoryInput value={field.value} onChange={field.onChange} setDefaultCategory={setDefaultCategory} />
        )}
      />
      {errors.category && <p className="text-red-500">{errors.category.message}</p>}
      <input
        {...register('location')}
        placeholder={clubType === 'campus' ? '학교 내 동아리 위치' : '동아리 활동 지역'}
        className="rounded border p-2"
      />
      {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      <textarea
        {...register('description')}
        placeholder="동아리 한 줄 소개"
        className="resize-none rounded border p-2"
      />
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      <Controller
        name="tags"
        control={control}
        defaultValue={['', '']}
        render={({ field }) => (
          <TagInput
            value={field.value}
            onChange={field.onChange}
            defaultCampusClubType={defaultCampusClubType}
            defaultCategory={defaultCategory}
          />
        )}
      />
      <button type="submit" className="rounded bg-[#CAEABA] p-2 text-white">
        다음
      </button>
    </form>
  );
}

export default InfoForm;
