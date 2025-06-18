import { useState } from 'react';

import ToggleIcon from '@/icons/toggle-icon';
import PersonIcon from '@/icons/person-icon';
import RightArrowIcon5 from '@/icons/right-arrow-icon5';
import Header from '@/components/layout/header';
import BackButton from '@/components/common/back-button';
import PhotoSection from '@/components/feed/write/photo-section';

function WriteFeed() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isNicknameVisible, setIsNicknameVisible] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="flex h-screen flex-col justify-between px-[20px] pt-[68px]">
      <Header>
        <BackButton />
      </Header>
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[12px]">
            <div className="text-bold12 select-none">사진</div>
            <PhotoSection photos={photos} setPhotos={setPhotos} />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="text-bold12 select-none">제목</div>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력해주세요."
              className="text-regular14 h-[48px] w-full rounded-[8px] border border-gray0 px-[16px] placeholder:text-gray2"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <div className="text-bold12 select-none">내용</div>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={
                '동아리 활동을 자유롭게 자랑해주세요!\n#동아리 #모임 #연합\n등등의 해쉬태그를 통해 더 많은 사람들에게 홍보해보세요'
              }
              className="text-regular14 h-[155px] w-full resize-none rounded-[8px] border border-gray0 px-[16px] py-[18px] placeholder:text-gray2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-start justify-between">
            <div className="flex h-[35px] flex-col justify-between">
              <div className="text-bold16">작성자 이름도 함께 표시</div>
              <div className="text-bold10 text-primary">동아리 이름 옆에 작성자의 이름도 함께 표시됩니다</div>
            </div>
            <button type="button" onClick={() => setIsNicknameVisible((prev) => !prev)}>
              <ToggleIcon active={isNicknameVisible} />
            </button>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-bold16">비공개</div>
              <div className="text-bold10 text-primary">부원들만 볼 수 있습니다</div>
            </div>
            <button type="button" onClick={() => setIsPrivate((prev) => !prev)}>
              <ToggleIcon active={isPrivate} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-bold16 flex items-center gap-[4px]">
              <PersonIcon />
              사람 태그
            </div>
            <RightArrowIcon5 />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="text-bold16 mb-[20px] flex h-[56px] w-full items-center justify-center rounded-[24px] bg-primary text-white"
      >
        게시
      </button>
    </div>
  );
}

export default WriteFeed;
