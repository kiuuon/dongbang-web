import { useState, useRef, useEffect } from 'react';

function FeedContent({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollWidth > el.clientWidth);
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
      className="text-regular14 mb-[16px] cursor-pointer"
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      {isExpanded || !isOverflowing ? (
        <div className="whitespace-pre-line">{content}</div>
      ) : (
        <div className="flex items-center">
          <div
            ref={containerRef}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ maxWidth: 'calc(100% - 50px)' }}
          >
            {content}
          </div>
          <span className="text-regular14 text-primary">더 보기</span>
        </div>
      )}
    </div>
  );
}

export default FeedContent;
