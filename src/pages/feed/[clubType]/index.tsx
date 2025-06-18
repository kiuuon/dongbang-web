import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import FeedHeader from '@/components/feed/feed-header';
import JoinClubPrompt from '@/components/feed/join-club-prompt';
import NotFeed from '@/components/feed/not-feed';
import BottomSheet from '@/components/common/bottom-sheet';
import { fetchPostsByClubType } from '@/lib/apis/post';

function Feed() {
  const observerElement = useRef(null);
  const router = useRouter();
  const { clubType } = router.query;
  const bottomSheetCloseRef = useRef<() => void>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['posts', clubType],
    queryFn: ({ pageParam }) => fetchPostsByClubType(clubType as 'my' | 'campus' | 'union', pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length ? allPages.length : undefined),
  });

  useEffect(() => {
    const target = observerElement.current;
    if (!target) return undefined;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        });
      },
      { threshold: 1 },
    );

    observerInstance.observe(target);

    return () => observerInstance.unobserve(target);
  }, [fetchNextPage, hasNextPage]);

  const getContent = () => {
    if (isPending) {
      return null;
    }

    if (!data?.pages[0]) {
      return <JoinClubPrompt />;
    }

    if (data?.pages[0].length === 0) {
      return (
        <div>
          <NotFeed />
        </div>
      );
    }

    return data?.pages.map((page) =>
      page?.map((post) => (
        <div key={post.id} className="my-16">
          <h1>{post.author.name}</h1>
          <Image src={post.image_url} alt="post-image" width={500} height={500} />
          <p>{post.content}</p>
        </div>
      )),
    );
  };

  const goToSelectedClubType = (selectedClubType: string) => {
    router.push(`/feed/${selectedClubType}`);
    bottomSheetCloseRef.current?.();
  };

  return (
    <div>
      <FeedHeader setIsBottomSheetOpen={setIsBottomSheetOpen} />
      {getContent()}

      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          Loading...
        </div>
      )}
      {isBottomSheetOpen && (
        <BottomSheet
          setIsBottomSheetOpen={setIsBottomSheetOpen}
          onRequestClose={(closeFn) => {
            bottomSheetCloseRef.current = closeFn;
          }}
        >
          <div className="mb-[17px] mt-[10px] h-[4px] w-[37px] rounded-[10px] bg-gray1" />
          <div className="flex h-[306px] w-full flex-col">
            {clubType !== 'my' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => goToSelectedClubType('my')}
              >
                내 동아리
              </button>
            )}
            {clubType !== 'campus' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => goToSelectedClubType('campus')}
              >
                교내 동아리
              </button>
            )}
            {clubType !== 'union' && (
              <button
                type="button"
                className="text-bold16 flex h-[66px] w-full items-center border-b border-b-gray0"
                onClick={() => goToSelectedClubType('union')}
              >
                연합 동아리
              </button>
            )}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

export default Feed;
