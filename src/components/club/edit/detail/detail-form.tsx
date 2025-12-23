import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { clubDetailSchema } from '@/lib/validationSchema';

import { upload } from '@/lib/apis/image';
import { editClubInfo, fetchClubInfo } from '@/lib/apis/club/club';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import clubInfoStore from '@/stores/club-info-store';
import { NewClubType } from '@/types/club-type';
import LocationMarkerIcon from '@/icons/location-marker-icon';
import SubmitButton from '@/components/common/submit-button';
import Loading from '@/components/common/loading';
import BackgroundInput from './background-input';
import LogoInput from './logo-input';
import TagInput from '../info/tag-input';

function DetailForm({ isClubIdValid }: { isClubIdValid: boolean }) {
  const router = useRouter();
  const { clubId } = router.query;
  const uuid = crypto.randomUUID();
  const queryClient = useQueryClient();
  const clubCampusType = clubInfoStore((state) => state.campusClubType);
  const name = clubInfoStore((state) => state.name);
  const category = clubInfoStore((state) => state.category);
  const location = clubInfoStore((state) => state.location);
  const bio = clubInfoStore((state) => state.bio);
  const description = clubInfoStore((state) => state.description);
  const tags = clubInfoStore((state) => state.tags);
  const [isLoading, setIsLoading] = useState(false);
  const [desciptionType, setDescriptionType] = useState('bio');
  const [logoPreview, setLogoPreview] = useState('');
  const [backgroundPreview, setBackgroundPreview] = useState('');

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    enabled: isClubIdValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      tags,
    },
    mode: 'onChange',
    resolver: yupResolver(clubDetailSchema),
  });

  useEffect(() => {
    if (clubInfo) {
      setLogoPreview(clubInfo.logo);
      setBackgroundPreview(clubInfo.background);
      setValue('logo', '', { shouldValidate: true });
      setValue('tags', tags, { shouldValidate: true });
    }
  }, [clubInfo, tags, setValue]);

  const { mutateAsync: uploadLogo } = useMutation({
    mutationFn: ({ file, fileName }: { file: File | string; fileName: string }) => upload(file, fileName, 'club-image'),
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.IMAGE.LOGO_UPLOAD_FAILED, () => setIsLoading(false)),
  });

  const { mutateAsync: uploadBackground } = useMutation({
    mutationFn: ({ file, fileName }: { file: File; fileName: string }) => upload(file, fileName, 'club-image'),
    onError: (error) =>
      handleMutationError(error, ERROR_MESSAGE.IMAGE.BACKGROUND_UPLOAD_FAILED, () => setIsLoading(false)),
  });

  const { mutate: handleEditClub } = useMutation({
    mutationFn: async (body: NewClubType) => editClubInfo(body, clubId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      clubInfoStore.setState({
        campusClubType: undefined,
        name: '',
        category: '',
        location: '',
        bio: '',
        description: '',
        tags: [],
      });
      router.push('/club');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.EDIT_FAILED, () => setIsLoading(false)),
  });

  const onSubmit = async (data: { logo: File | string; background?: File | null; tags: string[] }) => {
    try {
      setIsLoading(true);

      let logo: string = '';

      if (logoPreview === clubInfo?.logo) {
        logo = logoPreview;
      } else if (data.logo) {
        const logoFileName = `logo/${uuid}.png`;
        const uploadResult = await uploadLogo({ file: data.logo, fileName: logoFileName });
        logo = uploadResult.publicUrl;
      }

      let background: string | null = null;

      if (backgroundPreview === clubInfo?.background) {
        background = backgroundPreview;
      }

      if (data.background) {
        setIsLoading(true);
        const backgroundFileName = `background/${uuid}.png`;
        const uploadResult = await uploadBackground({ file: data.background, fileName: backgroundFileName });
        background = uploadResult.publicUrl;
      }

      const body = {
        type: clubInfo.type,
        detail_type: clubCampusType || null,
        name,
        category,
        location,
        bio,
        description,
        tags: data.tags,
        logo,
        background,
      };

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'event',
            action: 'edit club',
            payload: {
              type: router.query.clubType as string,
              logo,
              background,
              tags: data.tags,
            },
          }),
        );
      } else {
        handleEditClub(body);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error uploading files:', error);
    }
  };

  return (
    <form className="flex h-full min-h-[calc(100vh-92px)] flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-[16px] flex flex-col">
        <Controller
          name="background"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <BackgroundInput
              onChange={field.onChange}
              backgroundPreview={backgroundPreview}
              setBackgroundPreview={setBackgroundPreview}
            />
          )}
        />
        {errors.background && <p className="text-regular10 mt-[8px] text-error">{errors.background.message}</p>}

        <div className="relative">
          <div className="absolute top-[-53px] flex w-full flex-col gap-[20px]">
            {/* club profile */}
            <div className="px-[20px]">
              <div className="flex flex-col rounded-[8px] bg-white px-[12px] pb-[8px] pt-[12px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.15)]">
                <div className="flex gap-[14px]">
                  <Controller
                    name="logo"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <LogoInput onChange={field.onChange} logoPreview={logoPreview} setLogoPreview={setLogoPreview} />
                    )}
                  />
                  <div className="flex flex-col justify-center">
                    <div className="text-bold24">{name}</div>
                    {clubInfo?.type === 'campus' && (
                      <div className="text-regular14 flex items-center gap-[3px] text-gray3">
                        <LocationMarkerIcon />
                        {location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="my-[8px] flex flex-wrap gap-[8px]">
                  <div className="text-bold10 rounded-[8px] bg-gray1 p-[5px]">
                    {clubInfo?.type === 'campus' ? '교내' : '연합'}
                  </div>
                  {tags.map((tag) => (
                    <div className="text-bold10 rounded-[8px] bg-gray1 p-[5px]">{tag}</div>
                  ))}
                </div>

                <div className="flex flex-col items-start">
                  <div className="text-regular12 whitespace-pre-line text-gray2">
                    {desciptionType === 'bio' ? bio : description}
                  </div>
                  <button
                    type="button"
                    className="text-bold12 text-primary"
                    onClick={() => {
                      if (desciptionType === 'bio') {
                        setDescriptionType('description');
                      } else {
                        setDescriptionType('bio');
                      }
                    }}
                  >
                    {desciptionType === 'bio' ? '더보기' : '숨기기'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[20px] bg-white px-[20px]">
              {/* tag input */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />}
              />
              <SubmitButton disabled={!isValid || isSubmitting}>수정하기</SubmitButton>
            </div>
          </div>
        </div>
      </div>

      {isLoading && <Loading />}
    </form>
  );
}

export default DetailForm;
