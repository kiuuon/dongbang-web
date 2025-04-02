import { useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clubDetailSchema } from '@/lib/validationSchema';

import { upload } from '@/lib/apis/image';
import clubInfoStore from '@/stores/create-club/club-info-store';
import ActivityInput from './ativity-input';
import LogoInput from './logo-input';

function DetailForm() {
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

  const { mutateAsync: uploadLogo } = useMutation({
    mutationFn: ({ file, fileName }: { file: string; fileName: string }) => upload(file, fileName),
  });

  const { mutateAsync: uploadActivityPhoto } = useMutation({
    mutationFn: ({ file, fileName }: { file: string; fileName: string }) => upload(file, fileName),
  });

  const onSubmit = async (data: { logo: string; activity: string[]; description: string }) => {
    try {
      const logoFileName = `logo/${uuid}.png`;
      const logo = await uploadLogo({ file: data.logo, fileName: logoFileName });

      const activityUploadPromises = data.activity.map((file) => {
        const activityFileName = `activity/${uuid}.png`;
        return uploadActivityPhoto({ file, fileName: activityFileName });
      });
      const activityResults = await Promise.all(activityUploadPromises);
      const activityPhotos = activityResults.map((res) => res.publicUrl);

      const body = {
        detailClubType: clubCampusType,
        name,
        category,
        location,
        description,
        tags,
        logo,
        activityPhotos,
        detailDescription: data.description,
      };

      // TODO: API 요청
      console.log(body);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <form className="flex flex-col gap-[32px]" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="logo"
        control={control}
        defaultValue=""
        render={({ field }) => <LogoInput value={field.value} onChange={field.onChange} />}
      />
      {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
      <Controller
        name="activity"
        control={control}
        defaultValue={[]}
        render={({ field }) => <ActivityInput value={field.value as string[]} onChange={field.onChange} />}
      />
      {errors.activity && <p className="text-red-500">{errors.activity.message}</p>}
      <div className="flex flex-col gap-[8px]">
        <p>동아리 상세 설명</p>
        <textarea {...register('description')} className="h-[256px] w-full resize-none rounded border p-2" />
      </div>
      {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      <button type="submit" className="rounded bg-[#CAEABA] p-2 text-white">
        개설하기
      </button>
    </form>
  );
}

export default DetailForm;
