import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clubDetailSchema } from '@/lib/validationSchema';

import { upload } from '@/lib/apis/image';
import { createClub } from '@/lib/apis/club';
import clubInfoStore from '@/stores/club-info-store';
import { ClubType } from '@/types/club-type';
import SubmitButton from '@/components/common/submit-button';
import Loading from '@/components/common/loading';
import ActivityInput from './ativity-input';
import LogoInput from './logo-input';

function DetailForm() {
  const router = useRouter();
  const uuid = crypto.randomUUID();
  const clubCampusType = clubInfoStore((state) => state.campusClubType);
  const name = clubInfoStore((state) => state.name);
  const category = clubInfoStore((state) => state.category);
  const location = clubInfoStore((state) => state.location);
  const description = clubInfoStore((state) => state.description);
  const tags = clubInfoStore((state) => state.tags);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(clubDetailSchema),
  });

  const { mutateAsync: uploadLogo, isPending: isLogoUploading } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName),
  });

  const { mutateAsync: uploadActivityPhoto, isPending: isActivityPhotoUploading } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName),
  });

  const { mutate: handleCreateClub, isPending } = useMutation({
    mutationFn: async (body: ClubType) => createClub(body),
    onSuccess: () => {
      router.replace('/post/my');
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const onSubmit = async (data: { logo: File; activity: File[]; description: string }) => {
    try {
      const logoFileName = `logo/${uuid}.png`;
      const { publicUrl: logo } = await uploadLogo({ file: data.logo, fileName: logoFileName });

      const activityUploadPromises = data.activity.map((file, index) => {
        const activityFileName = `activity/${uuid}/${index}.png`;
        return uploadActivityPhoto({ file, fileName: activityFileName });
      });
      const activityResults = await Promise.all(activityUploadPromises);
      const activityPhotos = activityResults.map((res) => res.publicUrl);

      const body = {
        type: router.query.clubType as string,
        detail_type: clubCampusType || null,
        name,
        category,
        location,
        description,
        tags,
        logo,
        activity_photos: activityPhotos,
        detail_description: data.description,
      };

      handleCreateClub(body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <form className="flex h-full min-h-[calc(100vh-92px)] flex-col justify-between" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[16px]">
        <div className="mt-[24px] flex flex-col">
          <Controller
            name="logo"
            control={control}
            defaultValue={undefined}
            render={({ field }) => <LogoInput onChange={field.onChange} />}
          />
          {errors.logo && <p className="text-regular10 mt-[8px] text-error">{errors.logo.message}</p>}
        </div>
        <div className="flex flex-col">
          <Controller
            name="activity"
            control={control}
            defaultValue={[]}
            render={({ field }) => <ActivityInput value={field.value} onChange={field.onChange} />}
          />
          {errors.activity && <p className="text-regular10 mt-[8px] text-error">{errors.activity.message}</p>}
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
      <SubmitButton disabled={!isValid || isSubmitting}>개설하기</SubmitButton>
      {(isPending || isLogoUploading || isActivityPhotoUploading) && <Loading />}
    </form>
  );
}

export default DetailForm;
