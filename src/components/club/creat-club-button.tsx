import { useRouter } from 'next/router';
import Image from 'next/image';

import PlusIcon from '@/icons/plus-icon';

function CreateClubButton() {
  const router = useRouter();

  return (
    <div className="relative flex w-[158px] flex-col items-center gap-[16px]">
      <Image src="/images/light.png" alt="조명" width={40} height={46} />
      <Image src="/images/door.png" alt="문" width={140} height={230} />
      <button
        type="button"
        className="text-regular10 absolute bottom-[22px] flex h-[74px] w-[99px] flex-col items-center justify-center"
        onClick={() => {
          router.push('/club/create');
        }}
      >
        <PlusIcon />
        개설하기
      </button>
    </div>
  );
}

export default CreateClubButton;
