import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchUserId } from '@/lib/apis/auth';
import { fetchNotificationSettings, updateNotificationSettings } from '@/lib/apis/notifications';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';
import ToggleIcon from '@/icons/toggle-icon';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';

function NotificationSettingsPage() {
  const queryClient = useQueryClient();

  const [isSame, setIsSame] = useState(false);
  const [commentNotificationEnabled, setCommentNotificationEnabled] = useState(false);
  const [likeNotificationEnabled, setLikeNotificationEnabled] = useState(false);
  const [tagNotificationEnabled, setTagNotificationEnabled] = useState(false);
  const [mentionNotificationEnabled, setMentionNotificationEnabled] = useState(false);
  const [newsNotificationEnabled, setNewsNotificationEnabled] = useState(false);

  const { data: userId } = useQuery({
    queryKey: ['userId'],
    queryFn: fetchUserId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.ID_FETCH_FAILED),
  });

  const { data: notificationSettings } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: () => fetchNotificationSettings(userId as string),
    enabled: !!userId,
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.NOTIFICATION.SETTINGS_FETCH_FAILED),
  });

  const { mutate: handleUpdateNotificationSettings } = useMutation({
    mutationFn: () =>
      updateNotificationSettings(
        userId as string,
        commentNotificationEnabled,
        likeNotificationEnabled,
        tagNotificationEnabled,
        mentionNotificationEnabled,
        newsNotificationEnabled,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
    },
    onError: (error) => handleQueryError(error, ERROR_MESSAGE.NOTIFICATION.SETTINGS_UPDATE_FAILED),
  });

  useEffect(() => {
    if (notificationSettings) {
      setCommentNotificationEnabled(notificationSettings.comment_notification);
      setLikeNotificationEnabled(notificationSettings.like_notification);
      setTagNotificationEnabled(notificationSettings.tag_notification);
      setMentionNotificationEnabled(notificationSettings.mention_notification);
      setNewsNotificationEnabled(notificationSettings.news_notification);
    }
  }, [notificationSettings]);

  useEffect(() => {
    if (notificationSettings) {
      setIsSame(
        commentNotificationEnabled === notificationSettings.comment_notification &&
          likeNotificationEnabled === notificationSettings.like_notification &&
          tagNotificationEnabled === notificationSettings.tag_notification &&
          mentionNotificationEnabled === notificationSettings.mention_notification &&
          newsNotificationEnabled === notificationSettings.news_notification,
      );
    }
  }, [
    notificationSettings,
    commentNotificationEnabled,
    likeNotificationEnabled,
    tagNotificationEnabled,
    mentionNotificationEnabled,
    newsNotificationEnabled,
  ]);

  const handleSave = () => {
    if (isSame) {
      return;
    }

    handleUpdateNotificationSettings();
  };

  return (
    <div className="flex h-screen flex-col px-[20px] pt-[61px]">
      <Header>
        <div className="flex items-center gap-[10px]">
          <BackButton />
          <div className="text-bold16">알림 범위 설정</div>
        </div>
        <button
          type="button"
          className={`text-regular14 mr-[12px] ${isSame ? 'text-gray1' : 'text-black'}`}
          onClick={() => handleSave()}
        >
          저장
        </button>
      </Header>

      <div className="text-regular12 text-gray1">푸쉬 설정은 설정 페이지에서 따로 관리합니다.</div>

      <div className="mb-[12px] mt-[8px] flex items-center justify-between rounded-[8px] border border-gray0 py-[13px] pl-[16px] pr-[12px]">
        <div>
          <div className="text-regular14">전체 설정</div>
          <div className="text-regular10 text-gray1">
            {/* eslint-disable-next-line no-nested-ternary */}
            {commentNotificationEnabled &&
            likeNotificationEnabled &&
            tagNotificationEnabled &&
            mentionNotificationEnabled &&
            newsNotificationEnabled
              ? '전체'
              : !commentNotificationEnabled &&
                  !likeNotificationEnabled &&
                  !tagNotificationEnabled &&
                  !mentionNotificationEnabled &&
                  !newsNotificationEnabled
                ? '꺼짐'
                : '세부 설정'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              commentNotificationEnabled ||
              likeNotificationEnabled ||
              mentionNotificationEnabled ||
              newsNotificationEnabled ||
              tagNotificationEnabled
            ) {
              setCommentNotificationEnabled(false);
              setLikeNotificationEnabled(false);
              setTagNotificationEnabled(false);
              setMentionNotificationEnabled(false);
              setNewsNotificationEnabled(false);
            } else {
              setCommentNotificationEnabled(true);
              setLikeNotificationEnabled(true);
              setTagNotificationEnabled(true);
              setMentionNotificationEnabled(true);
              setNewsNotificationEnabled(true);
            }
          }}
        >
          <ToggleIcon
            active={
              commentNotificationEnabled ||
              likeNotificationEnabled ||
              mentionNotificationEnabled ||
              newsNotificationEnabled ||
              tagNotificationEnabled
            }
          />
        </button>
      </div>

      <div className="flex flex-col">
        <div className="text-regular12 rounded-t-[8px] bg-secondary px-[16px] py-[13px] text-gray2">
          카테고리별로 다르게 설정할 수 있어요.
        </div>

        <div className="flex items-center justify-between rounded-b-[8px] border border-t-0 border-gray0 py-[13px] pl-[16px] pr-[13px]">
          <div>
            <div className="text-regular14">댓글</div>
            <div className="text-regular10 text-gray1">내 피드/내 댓글에 댓글이 달리면 알림을 받습니다.</div>
          </div>
          <button type="button" onClick={() => setCommentNotificationEnabled((prev) => !prev)}>
            <ToggleIcon active={commentNotificationEnabled} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-b-[8px] border border-t-0 border-gray0 py-[13px] pl-[16px] pr-[13px]">
          <div>
            <div className="text-regular14">좋아요</div>
            <div className="text-regular10 text-gray1">내 피드/내 댓글에 좋아요가 달리면 알림을 받습니다.</div>
          </div>
          <button type="button" onClick={() => setLikeNotificationEnabled((prev) => !prev)}>
            <ToggleIcon active={likeNotificationEnabled} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-b-[8px] border border-t-0 border-gray0 py-[13px] pl-[16px] pr-[13px]">
          <div>
            <div className="text-regular14">태그</div>
            <div className="text-regular10 text-gray1">피드에 태그되면 알림을 받습니다.</div>
          </div>
          <button type="button" onClick={() => setTagNotificationEnabled((prev) => !prev)}>
            <ToggleIcon active={tagNotificationEnabled} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-b-[8px] border border-t-0 border-gray0 py-[13px] pl-[16px] pr-[13px]">
          <div>
            <div className="text-regular14">언급</div>
            <div className="text-regular10 text-gray1">@언급으로 나를 언급한 활동에 알림을 받습니다.</div>
          </div>
          <button type="button" onClick={() => setMentionNotificationEnabled((prev) => !prev)}>
            <ToggleIcon active={mentionNotificationEnabled} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-b-[8px] border border-t-0 border-gray0 py-[13px] pl-[16px] pr-[13px]">
          <div>
            <div className="text-regular14">소식</div>
            <div className="text-regular10 text-gray1">동아리 소식 알림을 받습니다.</div>
          </div>
          <button type="button" onClick={() => setNewsNotificationEnabled((prev) => !prev)}>
            <ToggleIcon active={newsNotificationEnabled} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationSettingsPage;
