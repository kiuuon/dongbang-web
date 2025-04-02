import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clubDetailSchema } from '@/lib/validationSchema';

import ActivityInput from './ativity-input';
import LogoInput from './logo-input';

function DetailForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(clubDetailSchema),
  });

  const onSubmit = (data: { logo: string; activity: string }) => {
    console.log(data);
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
        render={({ field }) => <ActivityInput value={field.value} onChange={field.onChange} />}
      />
      {errors.activity && <p className="text-red-500">{errors.activity.message}</p>}
    </form>
  );
}

export default DetailForm;
