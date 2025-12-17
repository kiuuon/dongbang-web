import Image from 'next/image';

import { login } from '@/lib/apis/auth';

function KakaoLoginButton() {
  return (
    <button type="button" onClick={() => login('kakao')}>
      <Image src="/images/kakao_login.png" alt="카카오 로고" width={280} height={10} />
    </button>
  );
}

export default KakaoLoginButton;
