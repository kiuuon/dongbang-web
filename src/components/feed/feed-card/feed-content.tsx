import { useState, useRef, useEffect } from 'react';

function FeedContent({ content }: { content: string }) {
  const hiddenRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);

  const cleanedContent = content.replace(/[\s\n]+$/, '');

  const renderContentWithHashtags = (text: string) => {
    const parts = text.split(/(\s+)/);

    return parts.map((part, index) => {
      if (part.startsWith('#') && part.length > 1) {
        const tag = part.slice(1);
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            role="button"
            tabIndex={0}
            className="text-green cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement hashtag click handling
              // eslint-disable-next-line no-console
              console.log(tag);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
                // TODO: Implement hashtag click handling
                // eslint-disable-next-line no-console
                console.log(tag);
              }
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    const hiddenEl = hiddenRef.current;
    const visibleEl = visibleRef.current;
    if (!visibleEl || !hiddenEl) return;
    setIsOverflowing(hiddenEl.scrollHeight > visibleEl.clientHeight);
  }, [content]);

  const handleToggle = () => {
    if (isOverflowing) {
      setIsExpanded((prev) => !prev);
    }
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
      <div
        ref={hiddenRef}
        className="invisible absolute left-0 top-0 whitespace-pre-line"
        style={{ visibility: 'hidden', pointerEvents: 'none', position: 'absolute' }}
      >
        {renderContentWithHashtags(cleanedContent)}
      </div>
      {isExpanded || !isOverflowing ? (
        <div className="whitespace-pre-line">{renderContentWithHashtags(cleanedContent)}</div>
      ) : (
        <div className="flex items-center">
          <div
            ref={visibleRef}
            className="line-clamp-1 overflow-hidden whitespace-pre-line"
            style={{ maxWidth: 'calc(100% - 50px)' }}
          >
            {renderContentWithHashtags(cleanedContent)}
          </div>
          {content.split('\n')[0].length === 1 && <span className="text-regular14">...</span>}
          <span className="text-regular14 ml-[5px] text-primary">더 보기</span>
        </div>
      )}
    </div>
  );
}

export default FeedContent;
