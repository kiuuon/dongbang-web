import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { deleteInquiry, fetchMyRole, writeInquiryComment } from '@/lib/apis/club';
import { formatKoreanDate, handleMutationError, handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import { hasPermission } from '@/lib/club/service';
import LockIcon2 from '@/icons/lock-icon2';
import RightArrowIcon6 from '@/icons/right-arrow-icon6';
import MoreHorizontalIcon from '@/icons/more-horizontal-icon';
import TrashIcon2 from '@/icons/trash-icon2';

function InquiryCard({
  inquiry,
  onlyMine,
  excludePrivate,
  filter,
}: {
  inquiry: any;
  onlyMine: boolean;
  excludePrivate: boolean;
  filter: string;
}) {
  const router = useRouter();
  const { clubId } = router.query as { clubId: string };
  const queryClient = useQueryClient();

  const [commentValue, setCommentValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

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
  }, []);

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data: myRole } = useQuery({
    queryKey: ['myRole', clubId],
    queryFn: () => fetchMyRole(clubId),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ROLE_FETCH_FAILED),
  });

  useEffect(() => {
    if (textareaRef.current && userId && myRole) {
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userId, myRole]);

  const { mutate: handleWriteInquiry } = useMutation({
    mutationFn: () => writeInquiryComment(inquiry.id, commentValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiryList', clubId, onlyMine, excludePrivate, filter] });
      setCommentValue('');
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.WRITE_INQUIRY_FAILED),
  });

  const { mutate: handleDeleteInquiry } = useMutation({
    mutationFn: () => deleteInquiry(inquiry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiryList', clubId, onlyMine, excludePrivate, filter] });
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.CLUB.DELETE_INQUIRY_FAILED),
  });

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(event.target.value);
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  if (inquiry.is_private && inquiry.author_id !== userId && !hasPermission(myRole, 'answer_inquiry')) {
    return (
      <div className="text-regular14 flex h-[68px] w-full items-center justify-center gap-[4px] rounded-[8px] border border-gray0 text-gray2">
        <LockIcon2 /> 비공개 문의입니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[8px] rounded-[8px] border border-gray0 px-[14px] py-[8px]">
      <div className="relative flex justify-between">
        <div className="flex items-center gap-[6px]">
          <div className="text-regular10">{formatKoreanDate(inquiry.created_at)}</div>
          {inquiry.is_private && <div className="text-regular10 text-gray2">· 비공개</div>}
        </div>
        {(inquiry.author_id === userId || hasPermission(myRole, 'answer_inquiry')) && (
          <button ref={moreButtonRef} type="button" onClick={() => setIsDropDownOpen((prev) => !prev)}>
            <MoreHorizontalIcon />
          </button>
        )}
        {isDropDownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-[24px] z-10 flex flex-col gap-[11px] rounded-[4px] bg-white p-[10px] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.25)]"
          >
            <button
              type="button"
              className="flex w-full items-center gap-[9px]"
              onClick={() => {
                handleDeleteInquiry();
              }}
            >
              <TrashIcon2 />
              <span className="text-regular16 whitespace-nowrap text-gray3">삭제</span>
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-start gap-[4px]">
          <div className="text-bold14 whitespace-nowrap">Q :</div>
          <div className="text-regular14 whitespace-pre-wrap break-all text-gray2">{inquiry.content}</div>
        </div>
        {inquiry.comments.map((comment: any) => {
          if (comment.author_id === inquiry.author_id) {
            return (
              <div className="flex items-start gap-[4px]">
                <div className="text-bold14 whitespace-nowrap">Q :</div>
                <div className="text-regular14 whitespace-pre-wrap break-all text-gray2">{comment.content}</div>
              </div>
            );
          }

          return (
            <div className="flex items-start gap-[4px] pl-[19px]">
              <div className="text-bold14 whitespace-nowrap text-primary">A :</div>
              <div className="text-regular14 whitespace-pre-wrap break-all text-gray2">{comment.content}</div>
            </div>
          );
        })}
      </div>
      {(inquiry.author_id === userId || hasPermission(myRole, 'answer_inquiry')) && (
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            rows={1}
            value={commentValue}
            placeholder="댓글을 달아주세요"
            className="text-regular14 leading box-border w-full resize-none overflow-hidden rounded-[8px] border border-gray0 py-[9px] pl-[21px] pr-[52px] leading-normal outline-none placeholder:text-gray2"
            onChange={handleInput}
          />
          {commentValue !== '' && (
            <button
              type="button"
              className="absolute bottom-[14px] right-[7px]"
              onClick={() => {
                if (commentValue === '') return;

                handleWriteInquiry();
              }}
            >
              <RightArrowIcon6 />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default InquiryCard;
