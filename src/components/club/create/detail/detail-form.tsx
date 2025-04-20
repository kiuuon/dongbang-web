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
    formState: { errors },
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
    <form className="flex h-full min-h-screen flex-col justify-between pt-[112px]" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-[8px]">
        <Controller
          name="logo"
          control={control}
          defaultValue={undefined}
          render={({ field }) => <LogoInput onChange={field.onChange} />}
        />
        {errors.logo && <p className="text-regular12 text-error">{errors.logo.message}</p>}
        <Controller
          name="activity"
          control={control}
          defaultValue={[]}
          render={({ field }) => <ActivityInput value={field.value} onChange={field.onChange} />}
        />
        {errors.activity && <p className="text-regular12 text-error">{errors.activity.message}</p>}
        <div>
          <label htmlFor="description" className="text-bold16 mb-[2px] flex text-gray2">
            동아리 상세 설명
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="h-[240px] w-full resize-none rounded border border-gray0 p-[8px]"
          />
        </div>
        {errors.description && <p className="text-regular12 text-error">{errors.description.message}</p>}
        <div className="flex flex-col gap-[5px]">
          <p className="text-bold16 ml-[20px] h-[19px]">주의사항</p>
          <ul>
            <li className="text-regular16 h-[38px] text-error">
              <p className="h-[19px]">존재하지 않는 동아리라 판단시 운영자에 의해 삭제될</p>
              <p className="h-[19px]">수 있습니다.</p>
            </li>
          </ul>
          <ul>
            <li className="text-regular16 h-[38px] text-error">
              <p className="h-[19px]">동아리 개설 후 한달동안 동아리원이 2명 이하일 경우</p>
              <p className="h-[19px]">삭제될 수 있습니다.</p>
            </li>
          </ul>
        </div>
      </div>
      <SubmitButton>개설하기</SubmitButton>
      {(isPending || isLogoUploading || isActivityPhotoUploading) && <Loading />}
    </form>
  );
}

export default DetailForm;
