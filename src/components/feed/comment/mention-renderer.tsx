import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { fetchUserListByNicknames } from '@/lib/apis/user';
import { handleQueryError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

function MentionRenderer({ text }: { text: string }) {
  const router = useRouter();

  const matches = text.match(/@[\w가-힣]+/g) || [];
  const nicknames = [...new Set(matches.map((m) => m.substring(1)))];

  const { data: mentionedUsers } = useQuery({
    queryKey: ['mentionedUsers', nicknames],
    enabled: nicknames.length > 0,
    queryFn: () => fetchUserListByNicknames(nicknames),
    throwOnError: (error) => handleQueryError(error, ERROR_MESSAGE.USER.LIST_FETCH_FAILED),
  });

  const userMap = Object.fromEntries(mentionedUsers?.map((u: any) => [u.nickname, u]) || []);

  const parts = text.split(/(@[\w가-힣]+)|(\n)/g).filter(Boolean);

  /* eslint-disable react/no-array-index-key */
  return (
    <span>
      {parts.map((part, index) => {
        if (part === '\n') return <br key={index} />;

        if (part.startsWith('@') && part.length > 1) {
          const nickname = part.substring(1);
          const user = userMap[nickname];

          if (!user) {
            return <span key={index}>{part}</span>;
          }

          return (
            <span
              key={index}
              role="button"
              tabIndex={0}
              className="text-regular16 cursor-pointer bg-tag text-tertiary"
              onClick={(event) => {
                event.stopPropagation();
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({
                      type: 'event',
                      action: 'go to profile page',
                      payload: user.nickname,
                    }),
                  );
                  return;
                }

                sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

                router.push(`/profile/${user.nickname}`);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(
                      JSON.stringify({
                        type: 'event',
                        action: 'go to profile page',
                        payload: user.id,
                      }),
                    );
                    return;
                  }

                  sessionStorage.setItem(`scroll:${router.asPath}`, `${document.scrollingElement?.scrollTop || 0}`);

                  router.push(`/profile/${user.nickname}`);
                }
              }}
            >
              {user.name}
            </span>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export default MentionRenderer;
