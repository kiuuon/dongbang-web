import Image from 'next/image';

import { login } from '@/lib/apis/auth';

function AppleLoginButton() {
  return (
    <button type="button" className="mb-[25px] mt-[8px]" onClick={() => login('apple')}>
      <Image src="/images/apple_login.png" alt="애플 로고" width={280} height={10} />
    </button>
  );
}

export default AppleLoginButton;
