import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { fetchSession } from '@/lib/apis/auth';
import { checkIsClubMember, fetchClubInfo } from '@/lib/apis/club';
import { handleQueryError, isValidUUID } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import MessageIcon from '@/icons/message-icon';
import MoreVertIcon from '@/icons/more-vert-icon';
import ExternalLinkIcon from '@/icons/external-link-icon';
import BackButton from '@/components/common/back-button';

function ClubHeader({
  dropdownRef,
  setIsDropDownOpen,
}: {
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  setIsDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { clubId } = router.query;

  const [isTop, setIsTop] = useState(true);

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.scrollingElement?.scrollTop || 0;
      setIsTop(scrollTop === 0);
    };

    handleScroll();

    document.addEventListener('scroll', handleScroll);

    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current?.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, setIsDropDownOpen]);

  const isValid = isValidUUID(clubId as string);

  const { data: session, isPending } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data: clubInfo } = useQuery({
    queryKey: ['club', clubId],
    queryFn: () => fetchClubInfo(clubId as string),
    enabled: isValid,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.INFO_FETCH_FAILED),
  });

  const { data: isClubMember, isPending: isPendingToCheckingClubMember } = useQuery({
    queryKey: ['isClubMember', clubId],
    queryFn: () => checkIsClubMember(clubId as string),
    enabled: !!clubInfo,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.JOIN_STATUS_FETCH_FAILED),
  });

  const clickShareButton = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_SITE_URL}/club/${clubId}`;
      await navigator.clipboard.writeText(url);
      toast.success('피드 링크가 클립보드에 복사되었습니다!');
    } catch (error) {
      toast.error('피드 링크 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 m-auto flex h-[60px] w-full max-w-[600px] items-center justify-between ${isTop ? '' : 'bg-white'} px-[20px]`}
    >
      <BackButton color={isTop ? '#fff' : '#000'} />
      <div className="flex gap-[10px]">
        {!isPending && session?.user && !isPendingToCheckingClubMember && isClubMember && (
          <button type="button">
            <MessageIcon color={isTop ? '#fff' : '#000'} />
          </button>
        )}
        <button type="button" onClick={clickShareButton}>
          <ExternalLinkIcon color={isTop ? '#fff' : '#000'} />
        </button>
        <button ref={moreButtonRef} type="button" onClick={() => setIsDropDownOpen((prev) => !prev)}>
          <MoreVertIcon color={isTop ? '#fff' : '#000'} />
        </button>
      </div>
    </header>
  );
}

export default ClubHeader;
