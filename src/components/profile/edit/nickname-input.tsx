import { useMutation } from '@tanstack/react-query';

import { isNicknameExists } from '@/lib/apis/sign-up';
import { handleMutationError } from '@/lib/utils';
import { ERROR_MESSAGE } from '@/lib/constants';

function NicknameInput({
  value,
  onChange,
  onBlur,
  setIsDuplicate,
  setIsSameCheck,
  oldNickname,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  setIsDuplicate: (value: boolean) => void;
  setIsSameCheck: (value: boolean) => void;
  oldNickname: string;
}) {
  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);

    if (oldNickname === event.target.value) {
      setIsDuplicate(false);
      setIsSameCheck(true);
    } else {
      setIsDuplicate(false);
      setIsSameCheck(false);
    }
  };

  const { mutate: handleNicknameSameCheck } = useMutation({
    mutationFn: () => isNicknameExists(value),
    onSuccess: (data) => {
      if (oldNickname === value) {
        setIsDuplicate(false);
        setIsSameCheck(true);
        return;
      }
      if (data) {
        setIsDuplicate(true);
        setIsSameCheck(false);
      } else {
        setIsSameCheck(true);
        setIsDuplicate(false);
      }
    },
    onError: (error) => handleMutationError(error, ERROR_MESSAGE.USER.NICKNAME_DUPLICATE_CHECK_FAILED),
  });

  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor="nickname" className="text-bold12">
        사용자명
      </label>
      <div className="flex w-full gap-[4px]">
        <input
          id="nickname"
          value={value}
          placeholder="사용자명을 입력해주세요."
          className="text-regular14 flex h-[48px] w-full rounded-[8px] border border-gray0 pl-[16px] outline-none placeholder:text-gray1"
          onChange={handleNickname}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="text-bold12 flex h-[48px] w-[65px] min-w-[65px] items-center justify-center rounded-[8px] bg-primary text-white"
          onMouseDown={(event) => {
            event.preventDefault();
            handleNicknameSameCheck();
          }}
        >
          중복확인
        </button>
      </div>
    </div>
  );
}

export default NicknameInput;
