import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import exploreStore from '@/stores/explore-store';

function FeedContent({ content }: { content: string }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const setSearchTarget = exploreStore((state) => state.setSearchTarget);
  const setKeyword = exploreStore((state) => state.setKeyword);
  const setSelectedHashtag = exploreStore((state) => state.setSelectedHashtag);

  const clickHashtag = (tag: string) => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'event', action: 'hashtag click', payload: tag }));
      return;
    }

    setSearchTarget('hashtag');
    setKeyword(tag);
    setSelectedHashtag(tag);
    router.push('/explore');
  };

  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(?=#)|(\n)/g).filter(Boolean);

    return parts.map((part, index) => {
      if (part.startsWith('#') && part.length > 1) {
        const tag = part.slice(1);
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            role="button"
            tabIndex={0}
            className="cursor-pointer text-green"
            onClick={(event) => {
              event.stopPropagation();
              clickHashtag(tag);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.stopPropagation();
                clickHashtag(tag);
              }
            }}
          >
            {part}
          </span>
        );
      }
      // 해시태그 아닌 부분은 그대로 출력
      return part;
    });
  };

  const checkOverflow = useCallback(() => {
    const el = previewRef.current;
    if (!el) return;

    const hasNewline = content.includes('\n');
    const overflowX = el.scrollWidth > el.clientWidth;
    const overflowY = el.scrollHeight > el.clientHeight;

    setShowMore(hasNewline || overflowX || overflowY);
  }, [content]);

  // content가 변할 때 체크
  useEffect(() => {
    checkOverflow();
  }, [content, checkOverflow]);

  // 화면 사이즈가 변할 때 체크
  useEffect(() => {
    const ro = new ResizeObserver(checkOverflow);
    if (previewRef.current) ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [checkOverflow]);

  // 다시 접을 때 체크
  useEffect(() => {
    if (!isExpanded) checkOverflow();
  }, [isExpanded, checkOverflow]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="text-regular14 mb-[10px] cursor-pointer"
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {isExpanded ? (
        <div className="whitespace-pre-line break-words">{renderContentWithHashtags(content)}</div>
      ) : (
        <div className="flex items-center">
          <div ref={previewRef} className="line-clamp-1 overflow-hidden whitespace-pre-line break-words">
            {renderContentWithHashtags(content)}
          </div>

          {showMore && (
            <button type="button" className="ml-2 whitespace-nowrap text-primary">
              더보기
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default FeedContent;
