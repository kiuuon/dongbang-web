import { login } from '@/lib/apis/auth';
import DongbangIcon from '@/icons/dongbang-icon';
import KakaoIcon from '@/icons/kakao-icon';

function LoginModal({ onClose }: { onClose?: () => void }) {
  return (
    <div
      tabIndex={0}
      role="button"
      className="fixed bottom-0 left-0 right-0 z-50 m-auto flex h-screen w-screen max-w-[600px] items-center bg-black bg-opacity-60 px-[32px]"
      onClick={onClose}
      onKeyDown={onClose}
    >
      <div className="flex h-auto w-full flex-col items-center rounded-[20px] bg-white py-[30px]">
        <div className="H-[71px] flex flex-row items-center justify-center gap-[18px]">
          <DongbangIcon />
          <span className="text-bold24">동방</span>
        </div>
        <div className="text-bold24 mb-[40px] mt-[27px] text-center">
          로그인하고 동방의 <br />
          모든 기능을 만나보세요!
        </div>
        <div className="text-regular16 mb-[40px] mt-[27px] text-center text-gray3">
          더 많은 동아리 정보와 편리한 교류 기능을 <br />
          이용하려면 로그인이 필요해요.
        </div>

        <button
          type="button"
          className="flex h-[48px] w-[292px] flex-row items-center justify-center gap-[8px] rounded-[12px] bg-yellow1 pl-[27px]"
          onClick={() => login('kakao')}
        >
          <KakaoIcon />
          <span className="text-regular16 flex w-full items-center justify-center">카카오톡 계정으로 시작하기</span>
        </button>

        <button type="button" className="text-regular16 mt-[20px] text-gray3" onClick={onClose}>
          다음에 할게요
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
