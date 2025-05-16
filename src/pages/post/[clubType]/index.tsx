import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';
import Image from 'next/image';

import PostHeader from '@/components/post/post-header';
import JoinClubPrompt from '@/components/post/join-club-prompt';
import NotPost from '@/components/post/not-post';
import NavigationModal from '@/components/post/navigation-modal';
import { fetchPostsByClubType } from '@/lib/apis/post';

function Main() {
  const observerElement = useRef(null);
  const router = useRouter();
  const { clubType } = router.query;
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

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
          <NotPost />
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

  return (
    <div>
      <PostHeader setIsNavigationOpen={setIsNavigationOpen} />
      {getContent()}

      {hasNextPage && (
        <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
          Loading...
        </div>
      )}
      {isNavigationOpen && <NavigationModal setIsNavigationOpen={setIsNavigationOpen} />}
    </div>
  );
}

export default Main;
