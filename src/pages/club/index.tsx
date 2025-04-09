import { useRouter } from 'next/router';

function Club() {
  const router = useRouter();

  return (
    <div className="px-[20px]">
      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-[#FFD600] py-4 text-[#000000]"
        onClick={() => {
          router.push('/club/create');
        }}
      >
        동아리 생성하기
      </button>
    </div>
  );
}

export default Club;
