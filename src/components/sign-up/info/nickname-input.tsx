import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { isNicknameExists } from '@/lib/apis/sign-up';
import { signUpErrorMessages } from '@/lib/constants';
import userInfoStore from '@/stores/sign-up/user-info-store';
import userInfoErrorStore from '@/stores/sign-up/user-info-error-store';

function NicknameInput() {
  const nickname = userInfoStore((state) => state.nickname);
  const setNickname = userInfoStore((state) => state.setNickname);
  const setIsSameCheck = userInfoErrorStore((state) => state.setIsSameCheck);
  const isAvailableNickname = userInfoErrorStore((state) => state.isAvailableNickname);
  const setIsAvailableNickname = userInfoErrorStore((state) => state.setIsAvailableNickname);
  const [nicknameError, setNicknameError] = useState(false);
  const [sameNicknameError, setSameNicknameError] = useState(false);

  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameCheck(false);
    setIsAvailableNickname(false);
    setNickname(event.target.value);
  };

  const nicknameRegExp = /^[a-zA-Z가-힣]{2,8}$/;
  const handleNicknameBlur = () => {
    if (!nickname.match(nicknameRegExp)) {
      setNicknameError(true);
      setIsAvailableNickname(false);
    } else {
      setNicknameError(false);
    }
  };

  const { mutate: handleNicknameSameCheck } = useMutation({
    mutationFn: () => isNicknameExists(nickname),
    onSuccess: (data) => {
      if (data) {
        setIsAvailableNickname(false);
        setSameNicknameError(true);
      } else {
        setIsAvailableNickname(true);
        setSameNicknameError(false);
        setIsSameCheck(true);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  return (
    <div>
      <div className="text-[14px] text-[#969696]">닉네임</div>
      <div className="flex gap-[15px]">
        <input
          value={nickname}
          className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
          onChange={handleNickname}
          onBlur={handleNicknameBlur}
        />
        <button
          type="button"
          className="h-[20px] w-[50px] rounded-[10px] bg-[#E9E9E9] text-[10px] text-[#969696]"
          onClick={() => {
            if (nickname.match(nicknameRegExp)) {
              handleNicknameSameCheck();
            }
          }}
        >
          중복확인
        </button>
        {nicknameError && (
          <div className="flex items-center text-[6px] text-[#CB0101]">{signUpErrorMessages.nicknameErrorMessage}</div>
        )}
        {sameNicknameError && (
          <div className="flex items-center text-[6px] text-[#CB0101]">
            {signUpErrorMessages.sameNicknameErrorMessage}
          </div>
        )}
        {isAvailableNickname && (
          <div className="flex items-center text-[6px] text-[#008000]">
            {signUpErrorMessages.availableNicknameMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default NicknameInput;
