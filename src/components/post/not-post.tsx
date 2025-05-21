import Image from 'next/image';

function NotPost() {
  return (
    <div className="mt-[177px] flex w-full flex-col items-center justify-center gap-[25px]">
      <Image src="/images/post.gif" alt="post" width={70} height={70} priority />
      <p className="text-bold20 text-gray1">작성된 글이 없습니다</p>
    </div>
  );
}

export default NotPost;
