import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { fetchSession } from '@/lib/apis/auth';
import { fetchClubInquiries, writeInquiry } from '@/lib/apis/club/inquiry';
import { handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import loginModalStore from '@/stores/login-modal-store';
import ToggleIcon from '@/icons/toggle-icon';
import ToggleIcon2 from '@/icons/toggle-icon2';
import InquiryCard from './inquiry-card';

function IquirySection() {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const queryClient = useQueryClient();

  const [inquiryValue, setInquiryValue] = useState('');

  const [isPrivate, setIsPrivate] = useState(false);
  const [onlyMine, setOnlyMine] = useState(false);
  const [excludePrivate, setExcludePrivate] = useState(false);
  const [filter, setFilter] = useState('all');

  const observerElement = useRef(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setIsLoginModalOpen = loginModalStore((state) => state.setIsOpen);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInquiryValue(event.target.value);
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.SESSION.FETCH_FAILED),
  });

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    initialPageParam: 0,
    queryKey: ['inquiryList', clubId, onlyMine, excludePrivate, filter],
    queryFn: ({ pageParam }) => fetchClubInquiries(clubId, onlyMine, excludePrivate, filter, pageParam),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 20 ? allPages.length : undefined),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.CLUB.FETCH_INQUIRY_FAILED),
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

  const { mutate: handleWriteInquiry } = useMutation({
    mutationFn: () => writeInquiry(clubId, inquiryValue, isPrivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiryList', clubId, onlyMine, excludePrivate, filter] });
      setInquiryValue('');
      setIsPrivate(false);

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.WRITE_INQUIRY_FAILED),
  });

  return (
    <div className="mt-[32px] flex min-h-screen w-full flex-col pb-[80px]">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-regular14">문의하기</div>
          <div className="text-bold12 flex items-center gap-[12px]">
            비공개
            <button type="button" onClick={() => setIsPrivate((prev) => !prev)}>
              <ToggleIcon active={isPrivate} />
            </button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          rows={1}
          value={inquiryValue}
          placeholder="문의할 내용을 입력해 주세요"
          className="text-regular14 mb-[5px] mt-[4px] box-border h-[21px] resize-none overflow-hidden rounded-[8px] border border-gray0 px-[14px] pb-[48px] pt-[10px] leading-normal outline-none placeholder:text-gray2"
          onChange={handleInput}
        />
        <button
          type="button"
          className={`text-bold12 flex h-[40px] w-full items-center justify-center rounded-[16px] ${inquiryValue === '' ? 'bg-gray0' : 'bg-primary'} text-white`}
          onClick={() => {
            if (inquiryValue === '') return;

            if (!session?.user) {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'open login modal',
                  }),
                );
                return;
              }

              setIsLoginModalOpen(true);

              return;
            }

            handleWriteInquiry();
          }}
        >
          확인
        </button>
      </div>
      <div className="-ml-[20px] mb-[16px] mt-[12px] h-[3px] min-h-[3px] w-[calc(100%+40px)] bg-background" />
      <div className="flex flex-col gap-[17px]">
        <div className="flex flex-col gap-[13px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[10px]">
              <button
                type="button"
                className={`${filter === 'all' ? 'text-black' : 'text-gray1'} text-regular10`}
                onClick={() => {
                  setFilter('all');
                }}
              >
                전체
              </button>
              <button
                type="button"
                className={`${filter === 'answered' ? 'text-black' : 'text-gray1'} text-regular10`}
                onClick={() => {
                  setFilter('answered');
                }}
              >
                답변완료
              </button>
              <button
                type="button"
                className={`${filter === 'unanswered' ? 'text-black' : 'text-gray1'} text-regular10`}
                onClick={() => {
                  setFilter('unanswered');
                }}
              >
                미답변
              </button>
            </div>
            <button type="button" className="flex items-center gap-[8px]" onClick={() => setOnlyMine((prev) => !prev)}>
              <div className="text-regular10">내 문의 보기</div>
              <ToggleIcon2 active={onlyMine} />
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-[10px]"
            onClick={() => setExcludePrivate((prev) => !prev)}
          >
            <div
              className={`${excludePrivate ? 'bg-primary' : 'border border-gray2 bg-white'} h-[14px] w-[14px] rounded-full`}
            />
            <div className="text-regular10">비밀글 제외</div>
          </button>
        </div>
        <div className="flex flex-col gap-[12px]">
          {data?.pages[0].length === 0 ? (
            <div className="text-bold24 mt-[80px] flex w-full items-center justify-center">문의 없음</div>
          ) : (
            data?.pages.map((page) =>
              page.map((inquiry: any) => (
                <InquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  onlyMine={onlyMine}
                  excludePrivate={excludePrivate}
                  filter={filter}
                />
              )),
            )
          )}
        </div>
        {hasNextPage && (
          <div ref={observerElement} className="flex h-[40px] items-center justify-center text-[32px]">
            <ClipLoader size={30} color="#F9A825" />
          </div>
        )}
      </div>
    </div>
  );
}

export default IquirySection;
