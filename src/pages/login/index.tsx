import KakaoLoginButton from '@/components/login/KakaoLoginButton';
import DongBangIcon2 from '@/icons/dongbang-icon2';
import { useRouter } from 'next/router';

function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen max-w-[600px] items-center justify-center bg-white">
      <div className="flex w-fit flex-col items-center justify-center gap-[46px]">
        <div className="flex flex-col gap-[20px]">
          <div className="flex gap-[14px]">
            <div className="flex flex-col gap-[9px] rounded-[10px] border border-gray1 bg-white p-[10px] opacity-50">
              <div className="flex flex-col rounded-[10px] bg-background px-[5px] pb-[9px] pt-[5px]">
                <div className="h-[133px] w-[133px] rounded-[10px] bg-gray0" />
                <div className="mt-[8px] h-[10px] w-[115px] rounded-[10px] bg-gray0" />
                <div className="my-[6px] h-[10px] w-[78px] rounded-[10px] bg-gray0" />
                <div className="flex gap-[8px]">
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-secondary opacity-40" />
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-primary opacity-40" />
                </div>
              </div>

              <div className="flex flex-col rounded-[10px] bg-background px-[5px] pb-[9px] pt-[5px]">
                <div className="h-[133px] w-[133px] rounded-[10px] bg-gray0" />
                <div className="mt-[8px] h-[10px] w-[115px] rounded-[10px] bg-gray0" />
                <div className="my-[6px] h-[10px] w-[78px] rounded-[10px] bg-gray0" />
                <div className="flex gap-[8px]">
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-secondary opacity-40" />
                  <div className="h-[14px] w-[42px] rounded-[8px] bg-primary opacity-40" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-[6px] pt-[136px]">
              <div>
                <div className="text-regular12 flex items-end gap-[2px] text-gray2">
                  <DongBangIcon2 /> ongbang
                </div>
                <div className="text-bold20">
                  대학 동아리의 <br /> SNS 허브
                </div>
              </div>

              <div className="text-bold12 flex rounded-t-[15px] rounded-bl-[15px] bg-primary/30 px-[14px] py-[9px]">
                동방은 어떤 공간인가요?
              </div>
            </div>
          </div>

          <div className="text-bold12 flex rounded-t-[15px] rounded-br-[15px] bg-secondary/30 px-[14px] py-[9px]">
            모든 동아리들이 함께 어울릴 수 있는 동아리방입니다!
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-[25px]">
          <KakaoLoginButton />
          <button
            type="button"
            className="text-regular16 text-gray2"
            onClick={() => {
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    type: 'event',
                    action: 'look around',
                  }),
                );
                return;
              }
              router.push('/feed/all');
            }}
          >
            둘러보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
