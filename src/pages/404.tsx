import DongBangIcon3 from '@/icons/dongbang-icon3';
import Tab from '@/components/layout/tab';

export default function Custom404() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-[122px]">
      <div className="font-pretendard flex items-center gap-[7px] text-[64px] font-bold text-primary">
        4<DongBangIcon3 />4
      </div>
      <p className="text-regular16 text-center text-gray3">
        찾으시는 페이지가 사라졌거나
        <br /> 주소가 잘못 입력되었을 수 있어요.
      </p>
      <Tab />
    </div>
  );
}
