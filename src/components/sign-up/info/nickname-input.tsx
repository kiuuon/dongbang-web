import { useMutation } from '@tanstack/react-query';

import { isNicknameExists } from '@/lib/apis/sign-up';

function NicknameInput({
  value,
  onChange,
  onBlur,
  setIsDuplicate,
  setIsSameCheck,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  setIsDuplicate: (value: boolean) => void;
  setIsSameCheck: (value: boolean) => void;
}) {
  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
    setIsDuplicate(false);
    setIsSameCheck(false);
  };

  const { mutate: handleNicknameSameCheck } = useMutation({
    mutationFn: () => isNicknameExists(value),
    onSuccess: (data) => {
      if (data) {
        setIsDuplicate(true);
        setIsSameCheck(false);
      } else {
        setIsSameCheck(true);
        setIsDuplicate(false);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  return (
    <div className="flex flex-col gap-[10px]">
      <label htmlFor="nickname" className="text-bold12">
        닉네임
      </label>
      <div className="flex w-full gap-[4px]">
        <input
          id="nickname"
          value={value}
          placeholder="사용할 닉네임을 입력해주세요."
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
