import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clubDetailSchema } from '@/lib/validationSchema';

import { upload } from '@/lib/apis/image';
import { createClub } from '@/lib/apis/club';
import clubInfoStore from '@/stores/create-club/club-info-store';
import { ClubType } from '@/types/club-type';
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
      router.replace('/club/my');
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

      // TODO: API 요청
      handleCreateClub(body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <form className="my-[40px] flex flex-col gap-[32px]" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="logo"
        control={control}
        defaultValue={undefined}
        render={({ field }) => <LogoInput onChange={field.onChange} />}
      />
      {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
      <Controller
        name="activity"
        control={control}
        defaultValue={[]}
        render={({ field }) => <ActivityInput value={field.value} onChange={field.onChange} />}
      />
      {errors.activity && <p className="text-red-500">{errors.activity.message}</p>}
      <div className="flex flex-col gap-[8px]">
        <p>동아리 상세 설명</p>
        <textarea {...register('description')} className="h-[256px] w-full resize-none rounded border p-2" />
      </div>
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      <div>
        <p className="text-[15px]">주의사항</p>
        <p className="text-[13px] text-[#C80606]">존재하지 않는 동아리라 판단시 운영자에 의해 삭제될 수 있습니다</p>
        <p className="text-[13px] text-[#C80606]">
          동아리 개설 후 한달동안 동아리원이 2명 이하일 경우 삭제될 수 있습니다
        </p>
      </div>
      <button type="submit" className="rounded bg-[#CAEABA] p-2 text-white">
        개설하기
      </button>

      {(isPending || isLogoUploading || isActivityPhotoUploading) && <Loading />}
    </form>
  );
}

export default DetailForm;
